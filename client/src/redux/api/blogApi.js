import { apiSlice } from "./apiSlice";
import { BLOG_URL } from "../constants";

const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => ({
        url: `${BLOG_URL}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getBlogById: builder.query({
      query: (id) => ({
        url: `${BLOG_URL}/blog/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    getMyBlogs: builder.query({
      query: () => ({
        url: `${BLOG_URL}/my`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    getBlogsByUser: builder.query({
      query: (userId) => ({
        url: `${BLOG_URL}/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),

    createBlog: builder.mutation({
      query: (formData) => ({
        url: `${BLOG_URL}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blog"],
    }),

    editBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${BLOG_URL}/blog/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Blog", id },
        "Blog",
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${BLOG_URL}/blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Blog", id }, "Blog"],
    }),

    toggleLike: builder.mutation({
      query: (id) => ({
        url: `${BLOG_URL}/blog/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Blog", id }, "Like"],
    }),

    getlikeofblog: builder.query({
      query: (id) => ({
        url: `${BLOG_URL}/blog/${id}/likes`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Like", id }],
    }),
    registerView: builder.mutation({
      query: (id) => ({
        url: `${BLOG_URL}/blog/${id}/view`,
        method: `POST`,
      }),
      invalidatesTags: (result, error, id) => [{ type: "Blog", id }],
    }),
  }),
});
export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useGetMyBlogsQuery,
  useGetBlogsByUserQuery,
  useCreateBlogMutation,
  useEditBlogMutation,
  useDeleteBlogMutation,
  useToggleLikeMutation,
  useGetlikeofblogQuery,
  useRegisterViewMutation,
} = blogApi;
