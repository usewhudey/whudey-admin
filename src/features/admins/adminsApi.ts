// ==========================================
// features/admins/adminsApi.ts
// ==========================================

import { baseApi } from '../api/baseApi';
import type {
  AdminsResponse,
  AdminDetailsResponse,
  ActivitiesResponse,
  AdminFilters,
  ToggleStatusPayload,
  ToggleStatusResponse,
  ChangeRoleResponse,
} from '@/types/admin';

export const adminsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all admins with filters
    getAdmins: builder.query<AdminsResponse, AdminFilters | void>({
      query: filters => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.status) params.append('status', filters.status);
        if (filters?.role) params.append('role', filters.role);
        const query = params.toString();
        return `/admin/activities${query ? `?${query}` : ''}`;
      },
      providesTags: result =>
        result
          ? [
              ...result.admins.map(({ id }) => ({ type: 'Admin' as const, id })),
              { type: 'Admin', id: 'LIST' },
            ]
          : [{ type: 'Admin', id: 'LIST' }],
    }),

    // Get single admin details
    getAdminById: builder.query<AdminDetailsResponse, string>({
      query: adminId => `/admin/activities/${adminId}`,
      providesTags: (result, error, adminId) => [{ type: 'AdminDetails', id: adminId }],
    }),

    // Toggle admin status
    toggleAdminStatus: builder.mutation<
      ToggleStatusResponse,
      { adminId: string; payload: ToggleStatusPayload }
    >({
      query: ({ adminId, payload }) => ({
        url: `/admin/activities/${adminId}/status`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { adminId }) => [
        { type: 'Admin', id: adminId },
        { type: 'Admin', id: 'LIST' },
        { type: 'AdminDetails', id: adminId },
      ],
    }),

    // Get all activities
    getActivities: builder.query<ActivitiesResponse, AdminFilters | void>({
      query: filters => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        const query = params.toString();
        return `/admin/activities/activities${query ? `?${query}` : ''}`;
      },
      providesTags: ['AdminActivities'],
    }),

    // Change admin to seller
    changeAdminToSeller: builder.mutation<ChangeRoleResponse, string>({
      query: adminId => ({
        url: `/admin/activities/${adminId}/change`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, adminId) => [
        { type: 'Admin', id: adminId },
        { type: 'Admin', id: 'LIST' },
        { type: 'AdminDetails', id: adminId },
      ],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useToggleAdminStatusMutation,
  useGetActivitiesQuery,
  useChangeAdminToSellerMutation,
} = adminsApi;