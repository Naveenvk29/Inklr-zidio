import { apiSlice } from "./apiSlice";
import { COMMENT_URL } from "../constants";

const commentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addComment: builder.mutation({
      query: (data) => ({
        url: `${COMMENT_URL}/comment`,
        method: "POST",
        body: data,
      }),
      providesTags: (result, error, blogId) => [
        { type: "Comment", id: blogId },
      ],
    }),
    reportComment: builder.mutation({
      query: (id) => ({
        url: `${COMMENT_URL}/comment/${id}/report`,
        method: "POST",
      }),
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `${COMMENT_URL}/comment/${id}`,
        method: "DELETE",
      }),
    }),
    fetchAllCommentsByBlog: builder.query({
      query: (blogId) => ({
        url: `${COMMENT_URL}/${blogId}`,
        method: "GET",
      }),
      providesTags: (result, error, blogId) => [
        { type: "Comment", id: blogId },
      ],
    }),
  }),
});

export const {
  useAddCommentMutation,
  useReportCommentMutation,
  useDeleteCommentMutation,
  useFetchAllCommentsByBlogQuery,
} = commentApi;
