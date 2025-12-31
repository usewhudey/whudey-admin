// ==========================================
// features/sellers/sellersApi.ts
// ==========================================

import { baseApi } from '../api/baseApi';
import {
  SellersResponse,
  SellerDetailsResponse,
  GetSellersParams,
  SuspendSellerParams,
  SuspendSellerResponse,
  UnsuspendSellerResponse,
  GrantSubscriptionParams,
  GrantSubscriptionResponse,
  BulkEmailParams,
  BulkEmailResponse,
  ResetPasswordResponse,
  MakeAdminResponse,
  WarnSellerResponse,
} from '@/types/seller';

export const sellersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all sellers with filters
    getSellers: builder.query<SellersResponse, GetSellersParams>({
      query: params => ({
        url: '/admin/seller',
        params,
      }),
      providesTags: ['Sellers'],
    }),

    // Get seller details by ID
    getSellerDetails: builder.query<SellerDetailsResponse, string>({
      query: sellerId => `/admin/seller/${sellerId}`,
      providesTags: (result, error, sellerId) => [
        { type: 'SellerDetails', id: sellerId },
      ],
    }),

    // Suspend seller
    suspendSeller: builder.mutation<
      SuspendSellerResponse,
      { sellerId: string; data: SuspendSellerParams }
    >({
      query: ({ sellerId, data }) => ({
        url: `/admin/seller/${sellerId}/suspend`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sellers', 'SellerDetails'],
    }),

    // Unsuspend seller
    unsuspendSeller: builder.mutation<UnsuspendSellerResponse, string>({
      query: sellerId => ({
        url: `/admin/seller/${sellerId}/unsuspend`,
        method: 'POST',
      }),
      invalidatesTags: ['Sellers', 'SellerDetails'],
    }),
    // Warn seller
    warnSeller: builder.mutation<WarnSellerResponse, string>({
      query: sellerId => ({
        url: `/admin/seller/${sellerId}/warn`,
        method: 'POST',
      }),
      invalidatesTags: ['Sellers', 'SellerDetails'],
    }),

    // Delete seller permanently
    deleteSeller: builder.mutation<{ message: string }, string>({
      query: sellerId => ({
        url: `/admin/seller/${sellerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sellers'],
    }),

    // Grant subscription
    grantSubscription: builder.mutation<
      GrantSubscriptionResponse,
      { sellerId: string; data: GrantSubscriptionParams }
    >({
      query: ({ sellerId, data }) => ({
        url: `/admin/seller/${sellerId}/grant-subscription`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Sellers', 'SellerDetails'],
    }),

    // Send bulk email
    sendBulkEmail: builder.mutation<BulkEmailResponse, BulkEmailParams>({
      query: data => ({
        url: '/admin/seller/bulk-email',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset password
    resetSellerPassword: builder.mutation<ResetPasswordResponse, string>({
      query: sellerId => ({
        url: `/admin/seller/${sellerId}/reset-password`,
        method: 'POST',
      }),
    }),

    // Make admin (superadmin only)
    makeAdmin: builder.mutation<MakeAdminResponse, string>({
      query: sellerId => ({
        url: `/admin/seller/${sellerId}/make-admin`,
        method: 'POST',
      }),
      invalidatesTags: ['Sellers', 'SellerDetails'],
    }),
  }),
});

export const {
  useGetSellersQuery,
  useGetSellerDetailsQuery,
  useSuspendSellerMutation,
  useUnsuspendSellerMutation,
  useWarnSellerMutation,
  useDeleteSellerMutation,
  useGrantSubscriptionMutation,
  useSendBulkEmailMutation,
  useResetSellerPasswordMutation,
  useMakeAdminMutation,
} = sellersApi;
