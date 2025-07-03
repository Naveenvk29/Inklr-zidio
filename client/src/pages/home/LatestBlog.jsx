import React from "react";
import { useGetAllBlogsQuery } from "../../redux/api/blogApi";
import { Link } from "react-router-dom";

const LatestBlog = () => {
  const { data, error, isLoading } = useGetAllBlogsQuery();
  console.log(data);

  if (isLoading) return <div>Loading latest blogs...</div>;
  if (error) return <div>Error fetching blogs.</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-8 text-2xl font-bold">Latest Blogs</h2>
      {data?.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.slice(0, 5).map((blog) => (
            <div
              key={blog._id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow"
            >
              <img
                src={blog.blogImage?.url}
                alt={blog.title}
                className="h-40 w-full rounded object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold">{blog.title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                By{" "}
                <span className="font-medium">
                  {blog.author?.userName || "Unknown"}
                </span>{" "}
                · {new Date(blog.createdAt).toLocaleDateString()} ·{" "}
                <span className="italic">{blog.category?.name}</span>
              </p>
              <p className="mt-2 line-clamp-3 text-gray-600">
                {blog.description}
              </p>
              <Link
                to={`/blog/${blog._id}`}
                className="mt-4 inline-block text-indigo-600"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestBlog;
