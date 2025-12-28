// ==========================================
// features/issues/issuesApi.ts
// ==========================================

import { baseApi } from '../api/baseApi';
import type {
  IssuesResponse,
  IssueStatsResponse,
  IssueDetailsResponse,
  IssueFilters,
  UpdateStatusPayload,
  ResolveIssuePayload,
  UpdateStatusResponse,
  ResolveIssueResponse,
} from '@/types/issue';

export const issuesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get issue statistics
    getIssueStats: builder.query<IssueStatsResponse, void>({
      query: () => '/admin/issues/stats',
      providesTags: ['IssueStats'],
    }),

    // Get all issues with filters
    getIssues: builder.query<IssuesResponse, IssueFilters | void>({
      query: filters => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        const query = params.toString();
        return `/admin/issues${query ? `?${query}` : ''}`;
      },
      providesTags: result =>
        result
          ? [
              ...result.issues.map(({ id }) => ({ type: 'Issue' as const, id })),
              { type: 'Issue', id: 'LIST' },
            ]
          : [{ type: 'Issue', id: 'LIST' }],
    }),

    // Get single issue details
    getIssueById: builder.query<IssueDetailsResponse, string>({
      query: issueId => `/admin/issues/${issueId}`,
      providesTags: (result, error, issueId) => [{ type: 'Issue', id: issueId }],
    }),

    // Update issue status
    updateIssueStatus: builder.mutation<
      UpdateStatusResponse,
      { issueId: string; payload: UpdateStatusPayload }
    >({
      query: ({ issueId, payload }) => ({
        url: `/admin/issues/${issueId}/status`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { issueId }) => [
        { type: 'Issue', id: issueId },
        { type: 'Issue', id: 'LIST' },
        'IssueStats',
      ],
    }),

    // Resolve issue
    resolveIssue: builder.mutation<
      ResolveIssueResponse,
      { issueId: string; payload: ResolveIssuePayload }
    >({
      query: ({ issueId, payload }) => ({
        url: `/admin/issues/${issueId}/resolve`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { issueId }) => [
        { type: 'Issue', id: issueId },
        { type: 'Issue', id: 'LIST' },
        'IssueStats',
      ],
    }),
  }),
});

export const {
  useGetIssueStatsQuery,
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useUpdateIssueStatusMutation,
  useResolveIssueMutation,
} = issuesApi;