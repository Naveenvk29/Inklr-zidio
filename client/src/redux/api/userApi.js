import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    completeProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/complete-profile`,
        method: "PUT",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getCurrentProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      providesTags: ["User"],
      refetchOnMountOrArgChange: true,
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUserProfile: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getAllUser: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        method: "GET",
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
    }),
    follow: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/follow/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    unfollow: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/unfollow/${id}`,
        method: "PUT",
      }),
    }),
    getFollowers: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}/followers`,
        method: "GET",
      }),
    }),
    getFollowings: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}/following`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useCompleteProfileMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useFollowMutation,
  useUnfollowMutation,
  useGetFollowersQuery,
  useGetFollowingsQuery,
} = userApi;
