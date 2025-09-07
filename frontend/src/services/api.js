import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store new tokens
        localStorage.setItem('token', refreshResult.data.data.token);
        localStorage.setItem('refreshToken', refreshResult.data.data.refreshToken);
        
        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    } else {
      // No refresh token, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
  }

  return result;
};

// Create API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Tool', 'Booking', 'Review', 'Message'],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    getProfile: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Tool endpoints
    getTools: builder.query({
      query: (params) => ({
        url: '/tools',
        params,
      }),
      providesTags: ['Tool'],
    }),
    getTool: builder.query({
      query: (id) => `/tools/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tool', id }],
    }),
    createTool: builder.mutation({
      query: (toolData) => ({
        url: '/tools',
        method: 'POST',
        body: toolData,
      }),
      invalidatesTags: ['Tool'],
    }),
    updateTool: builder.mutation({
      query: ({ id, ...toolData }) => ({
        url: `/tools/${id}`,
        method: 'PUT',
        body: toolData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tool', id }],
    }),
    deleteTool: builder.mutation({
      query: (id) => ({
        url: `/tools/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tool'],
    }),
    getMyTools: builder.query({
      query: () => '/tools/my',
      providesTags: ['Tool'],
    }),
    checkToolAvailability: builder.query({
      query: ({ id, start, end }) => ({
        url: `/tools/${id}/availability`,
        params: { start, end },
      }),
    }),

    // Booking endpoints
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),
    getMyBookings: builder.query({
      query: () => '/bookings/my',
      providesTags: ['Booking'],
    }),
    getBooking: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    approveBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    declineBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/decline`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    markReturned: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/return`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // Review endpoints
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Review'],
    }),
    getUserReviews: builder.query({
      query: ({ userId, page = 1, limit = 10 }) => ({
        url: `/reviews/user/${userId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, { userId }) => [{ type: 'Review', id: userId }],
    }),
    getToolReviews: builder.query({
      query: ({ toolId, page = 1, limit = 10 }) => ({
        url: `/reviews/tool/${toolId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, { toolId }) => [{ type: 'Review', id: toolId }],
    }),

    // Message endpoints
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/messages',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['Message'],
    }),
    getMessages: builder.query({
      query: ({ bookingId, page = 1, limit = 50 }) => ({
        url: `/messages/booking/${bookingId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, { bookingId }) => [{ type: 'Message', id: bookingId }],
    }),
    getConversations: builder.query({
      query: () => '/messages/conversations',
      providesTags: ['Message'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth hooks
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  
  // Tool hooks
  useGetToolsQuery,
  useGetToolQuery,
  useCreateToolMutation,
  useUpdateToolMutation,
  useDeleteToolMutation,
  useGetMyToolsQuery,
  useCheckToolAvailabilityQuery,
  
  // Booking hooks
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingQuery,
  useApproveBookingMutation,
  useDeclineBookingMutation,
  useCancelBookingMutation,
  useMarkReturnedMutation,
  
  // Review hooks
  useCreateReviewMutation,
  useGetUserReviewsQuery,
  useGetToolReviewsQuery,
  
  // Message hooks
  useSendMessageMutation,
  useGetMessagesQuery,
  useGetConversationsQuery,
} = api;
