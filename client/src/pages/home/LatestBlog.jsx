import React from "react";
import { useGetAllBlogsQuery } from "../../redux/api/blogApi";
import { Link } from "react-router-dom";
import FollowerPointerCard from "../../components/FollowingPointer";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const LatestBlog = () => {
  const { data: blogs, error, isLoading } = useGetAllBlogsQuery();

  if (isLoading)
    return <div className="py-10 text-center">Loading latest blogs...</div>;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">
        Error fetching blogs.
      </div>
    );

  // Sort by newest first
  const sortedBlogs = [...blogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const latestFive = sortedBlogs.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-8 text-2xl font-bold text-neutral-800 dark:text-white">
        Latest Blogs
      </h2>

      {latestFive.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="wait">
            {latestFive.map((blog) => (
              <motion.div
                key={blog._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FollowerPointerCard
                  userName={blog.author?.userName}
                  avatar={blog.author?.avatar?.url}
                >
                  <div className="rounded-lg border border-neutral-300 bg-white p-3 shadow dark:border-neutral-700 dark:bg-neutral-800">
                    <img
                      src={blog.blogImage?.url}
                      alt={blog.title}
                      className="h-40 w-full rounded object-cover"
                    />
                    <h2 className="mt-4 text-xl font-semibold text-neutral-800 dark:text-white">
                      {blog.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      By{" "}
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {blog.author?.userName || "Unknown"}
                      </span>{" "}
                      ·{" "}
                      {formatDistanceToNow(new Date(blog.createdAt), {
                        addSuffix: true,
                      })}{" "}
                      · <span className="italic">{blog.category?.name}</span>
                    </p>
                    <p className="mt-2 line-clamp-3 text-gray-600 dark:text-gray-300">
                      {blog.description}
                    </p>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="mt-4 inline-block text-indigo-600 hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </FollowerPointerCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default LatestBlog;
