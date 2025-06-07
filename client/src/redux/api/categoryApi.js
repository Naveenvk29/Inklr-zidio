import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";

const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORY_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    fetchCategories: builder.query({
      query: () => CATEGORY_URL,
      providesTags: ["Category"],
    }),
    fetchCategorysBySlug: builder.query({
      query: (slug) => `${CATEGORY_URL}/${slug}`,
      providesTags: ["Category"],
    }),
    modifyCategory: builder.mutation({
      query: ({ slug, data }) => ({
        url: `${CATEGORY_URL}/${slug}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    removeCategory: builder.mutation({
      query: (slug) => ({
        url: `${CATEGORY_URL}/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
  useFetchCategorysBySlugQuery,
  useModifyCategoryMutation,
  useRemoveCategoryMutation,
} = categoryApi;
