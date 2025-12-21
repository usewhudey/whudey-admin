import { baseApi } from '../api/baseApi';
import {
  DashboardStatsResponse,
  RevenueChartResponse,
  UserGrowthResponse,
  RecentActivityResponse,
  RevenueChartParams,
  UserGrowthParams,
  RecentActivityParams,
} from '@/types/dashboard';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get Platform Stats
    getPlatformStats: builder.query<DashboardStatsResponse, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['DashboardStats'],
    }),

    // Get Revenue Chart
    getRevenueChart: builder.query<RevenueChartResponse, RevenueChartParams>({
      query: ({ period = 'daily', days = 30 } = {}) => ({
        url: '/admin/dashboard/revenue-chart',
        params: { period, days },
      }),
      providesTags: ['RevenueChart'],
    }),

    // Get User Growth Chart
    getUserGrowth: builder.query<UserGrowthResponse, UserGrowthParams>({
      query: ({ days = 30 } = {}) => ({
        url: '/admin/dashboard/user-growth',
        params: { days },
      }),
      providesTags: ['UserGrowth'],
    }),

    // Get Recent Activity
    getRecentActivity: builder.query<RecentActivityResponse, RecentActivityParams>({
      query: ({ limit = 50 } = {}) => ({
        url: '/admin/dashboard/recent-activity',
        params: { limit },
      }),
      providesTags: ['RecentActivity'],
    }),
  }),
});

export const {
  useGetPlatformStatsQuery,
  useGetRevenueChartQuery,
  useGetUserGrowthQuery,
  useGetRecentActivityQuery,
} = dashboardApi;