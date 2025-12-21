/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/authInterceptor.ts

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearUser } from '@/features/auth/authSlice';
import { APP_CONFIG } from './constants';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const useAuthInterceptor = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hasSetup = useRef(false);

  useEffect(() => {
    // Prevent duplicate setup
    if (hasSetup.current) return;
    hasSetup.current = true;

    // Token refresh function
    const refreshAuthToken = async (): Promise<boolean> => {
      try {
        const response = await fetch(`${APP_CONFIG.apiBaseUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Important: Include cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('✅ Token refreshed successfully');
          return true;
        }
        console.log('❌ Token refresh failed:', response.status);
        return false;
      } catch (error) {
        console.error('❌ Token refresh error:', error);
        return false;
      }
    };

    // Intercept fetch globally
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const [resource, config] = args;

      // First attempt
      let response = await originalFetch(resource, config);

      // If 401 Unauthorized, try to refresh token
      if (response.status === 401) {
        const url = (() => {
          if (typeof resource === 'string') return resource;
          if (resource instanceof Request) return resource.url;
          if (resource instanceof URL) return resource.href;
          return String(resource);
        })();

        // Don't retry on auth endpoints
        if (
          url.includes('/auth/login') ||
          url.includes('/auth/refresh') ||
          url.includes('/auth/logout')
        ) {
          return response;
        }

        

        // Handle token refresh with queue
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshSuccess = await refreshAuthToken();

            if (refreshSuccess) {
              console.log('✅ Token refresh successful, retrying request...');
              processQueue();
              isRefreshing = false;

              // Retry original request
              response = await originalFetch(resource, config);
              return response;
            } else {
              // Refresh failed - logout user
              console.log('❌ Refresh failed, logging out...');
              processQueue(new Error('Token refresh failed'));
              isRefreshing = false;

              dispatch(clearUser());
              router.push('/');
              return response;
            }
          } catch (error) {
            console.error('❌ Refresh error:', error);
            processQueue(error);
            isRefreshing = false;

            dispatch(clearUser());
            router.push('/');
            return response;
          }
        }

        // If already refreshing, queue this request
        console.log('⏳ Token refresh in progress, queueing request...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => originalFetch(resource, config))
          .catch(() => response);
      }

      return response;
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
      hasSetup.current = false;
    };
  }, [dispatch, router]);
};
