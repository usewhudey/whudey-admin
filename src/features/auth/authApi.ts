import { AuthResponse, ChangePasswordPayload, ChangePasswordResponse, LoginCredentials } from '@/types/auth';
import { baseApi } from '../api/baseApi';



export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({


    // Login
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: credentials => ({
        url: '/auth/admin-login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Get Current User
    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    // Refresh Token
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    // Change password
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordPayload
    >({
      query: payload => ({
        url: '/auth/password/change',
        method: 'POST',
        body: payload,
      }),
    }),

  }),
});

export const {

  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useChangePasswordMutation,
} = authApi;
