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
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log('✅ Token refreshed successfully');
          return true;
        }

        console.log('❌ Token refresh failed with status:', response.status);
        return false;
      } catch (error) {
        console.error('❌ Token refresh error:', error);
        return false;
      }
    };

    // Store original fetch
    const originalFetch = window.fetch;

    // Intercept fetch globally
    window.fetch = async (...args) => {
      const [resource, config] = args;

      // Make initial request
      const response = await originalFetch(resource, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        const url = (() => {
          if (typeof resource === 'string') return resource;
          if (resource instanceof Request) return resource.url;
          if (resource instanceof URL) return resource.href;
          return String(resource);
        })();

        // Skip auth endpoints
        if (
          url.includes('/auth/login') ||
          url.includes('/auth/register') ||
          url.includes('/auth/refresh') ||
          url.includes('/auth/logout')
        ) {
          return response;
        }

        console.log('🔄 Got 401 for:', url);

        // If not already refreshing, start refresh
        if (!isRefreshing) {
          isRefreshing = true;
          console.log('🔄 Starting token refresh...');

          try {
            const refreshSuccess = await refreshAuthToken();

            if (refreshSuccess) {
              console.log('✅ Token refresh successful, processing queue...');
              processQueue(); // Resolve all queued promises

              // Retry the original request
              const retryResponse = await originalFetch(resource, config);
              console.log('✅ Retried request, status:', retryResponse.status);

              isRefreshing = false;
              return retryResponse;
            } else {
              // Refresh failed - logout
              console.log('❌ Token refresh failed, logging out...');
              processQueue(new Error('Token refresh failed'));

              // Clear state and redirect
              dispatch(clearUser());

              // Small delay to ensure state is cleared
              setTimeout(() => {
                router.push('/');
              }, 100);

              isRefreshing = false;
              return response; // Return original 401
            }
          } catch (error) {
            console.error('❌ Token refresh exception:', error);
            processQueue(error);

            dispatch(clearUser());
            setTimeout(() => {
              router.push('/');
            }, 100);

            isRefreshing = false;
            return response;
          }
        } else {
          // Already refreshing - queue this request
          console.log('⏳ Token refresh in progress, queueing request...');

          return new Promise<Response>((resolve, reject) => {
            failedQueue.push({
              resolve: () => {
                // When queue is processed, retry the request
                originalFetch(resource, config).then(resolve).catch(reject);
              },
              reject,
            });
          });
        }
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