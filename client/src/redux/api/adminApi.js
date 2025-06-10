import { apiSlice } from "./apiSlice";
import { ADMIN_URL } from "../constants";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchReportedComments: builder.query({
      query: () => `${ADMIN_URL}/comments/reported`,
      providesTags: ["Comment"],
    }),

    toggleHideComment: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/comments/${id}/toggle-hide`,
        method: "PATCH",
      }),
      invalidatesTags: ["Comment"],
    }),

    banUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/user/${id}/ban`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Comment", "Blog"],
    }),

    modifyUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `${ADMIN_URL}/user/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    fetchBannedUsers: builder.query({
      query: () => `${ADMIN_URL}/banned/users`,
      providesTags: ["User"],
    }),

    fetchAdminStats: builder.query({
      query: () => `${ADMIN_URL}/stats`,
    }),
  }),
});

export const {
  useFetchReportedCommentsQuery,
  useToggleHideCommentMutation,
  useBanUserMutation,
  useDeleteUserMutation,
  useModifyUserRoleMutation,
  useFetchBannedUsersQuery,
  useFetchAdminStatsQuery,
} = adminApi;
