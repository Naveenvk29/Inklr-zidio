import React from "react";
import { useDeleteBlogByAdminMutation } from "../../../../redux/api/adminApi";
import { useGetAllBlogsQuery } from "../../../../redux/api/blogApi";
import { Link } from "react-router-dom";

const BlogCard = () => {
  const [deleteBlog] = useDeleteBlogByAdminMutation();
  const { data: blogs, isLoading } = useGetAllBlogsQuery();
  if (isLoading) return <p className="text-neutral-500">Loading blogs...</p>;
  if (!blogs || blogs.length === 0)
    return <p className="text-neutral-500">No blogs found</p>;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id).unwrap();
        alert("Blog deleted successfully");
      } catch (error) {
        console.error("Failed to delete blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  return (
    <div className="my-6">
      <h2 className="mb-4 text-xl font-semibold dark:text-white">Blogs</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="flex flex-col items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-2xl dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div>
              <img
                src={blog.blogImage?.url}
                alt={blog.title}
                className="h-20 w-20"
              />
              <h3 className="mb-2 text-lg font-semibold dark:text-white">
                {blog.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {blog.description}
              </p>
            </div>
            <div className="mt-4 flex w-full justify-between">
              <Link
                to={`/blog/${blog._id}`}
                className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
              >
                View
              </Link>

              <button
                onClick={() => handleDelete(blog._id)}
                className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogCard;
