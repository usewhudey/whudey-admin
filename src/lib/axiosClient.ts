import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from './constants';

// Create axios instance
const axiosClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - Add auth token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // JWT is in httpOnly cookie, so no need to manually add token
    // But we can add other headers if needed
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        await axios.post(
          `${APP_CONFIG.apiBaseUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

// Helper to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};