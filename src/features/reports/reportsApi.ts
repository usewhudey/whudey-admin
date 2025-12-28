// ==========================================
// features/reports/reportsApi.ts
// ==========================================

import { baseApi } from '../api/baseApi';
import {
  ReportsResponse,
  ReportStatsResponse,
  ReportDetailsResponse,
  ResolveReportResponse,
  GetReportsParams,
  ResolveReportParams,
} from '@/types/report';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get report stats
    getReportStats: builder.query<ReportStatsResponse, void>({
      query: () => '/admin/reports/stats',
      providesTags: ['ReportStats'],
    }),

    // Get all reports with filters
    getReports: builder.query<ReportsResponse, GetReportsParams>({
      query: params => ({
        url: '/admin/reports',
        params,
      }),
      providesTags: ['Reports'],
    }),

    // Get single report details
    getReportDetails: builder.query<ReportDetailsResponse, string>({
      query: reportId => `/admin/reports/${reportId}`,
      providesTags: (result, error, reportId) => [
        { type: 'ReportDetails', id: reportId },
      ],
    }),

    // Resolve report
    resolveReport: builder.mutation<
      ResolveReportResponse,
      { reportId: string; data: ResolveReportParams }
    >({
      query: ({ reportId, data }) => ({
        url: `/admin/reports/${reportId}/resolve`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reports', 'ReportStats', 'ReportDetails'],
    }),
  }),
});

export const {
  useGetReportStatsQuery,
  useGetReportsQuery,
  useGetReportDetailsQuery,
  useResolveReportMutation,
} = reportsApi;