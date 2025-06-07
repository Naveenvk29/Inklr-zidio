import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({}),
    completeProfile: builder.mutation({}),
    login: builder.mutation({}),
    logout: builder.mutation({}),
    getCurrentProfile: builder.query({}),
    updateUserProfile: builder.mutation({}),
    deleteUserProfile: builder.mutation({}),
    getAllUser: builder.query({}),
    getUserById: builder.query({}),
    follow: builder.mutation({}),
    unfollow: builder.mutation({}),
    getfollowers: builder.query({}),
    getfollowings: builder.query({}),
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
  useGetfollowersQuery,
  useGetfollowingsQuery,
} = userApi;
