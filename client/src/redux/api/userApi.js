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
    getFollowings: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}/following`,
        method: "GET",
      }),
    }),
    getFollowers: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}/followers`,
        method: "GET",
      }),
    }),
    toggleFollow: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/toggle-follow/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Followings", id: "LIST" },
        { type: "Followers", id },
      ],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    toggleSaveBlog: builder.mutation({
      query: (blogId) => ({
        url: `${USERS_URL}/blogs/${blogId}/toggle-save`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, blogId) => [
        { type: "SavedBlogs", id: "LIST" },
        { type: "SaveCount", id: blogId },
      ],
    }),

    fetchSavedBlogs: builder.query({
      query: () => ({
        url: `${USERS_URL}/me/saved-blogs`,
      }),
      providesTags: [{ type: "SavedBlogs", id: "LIST" }],
    }),

    fetchSaveCount: builder.query({
      query: (blogId) => ({
        url: `${USERS_URL}/blogs/${blogId}/save-count`,
      }),
      providesTags: (result, error, blogId) => [
        { type: "SaveCount", id: blogId },
      ],
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
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useToggleFollowMutation,
  useChangePasswordMutation,
  useToggleSaveBlogMutation,
  useFetchSaveCountQuery,
  useFetchSavedBlogsQuery,
} = userApi;
