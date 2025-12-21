// lib/api/baseApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { APP_CONFIG } from '@/lib/constants';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: APP_CONFIG.apiBaseUrl,
    credentials: 'include', // Include cookies for JWT
    prepareHeaders: headers => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'DashboardStats',
    'RevenueChart',
    'UserGrowth',
    'RecentActivity',
    'Sellers',
    'SellerDetails',
  ],
  endpoints: () => ({}),
});