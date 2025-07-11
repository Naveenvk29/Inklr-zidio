import { Link } from "react-router-dom";
import SaveButton from "../../../components/SaveButton";
import { useFetchSavedBlogsQuery } from "../../../redux/api/userApi";
import { useSelector } from "react-redux";
import { useFetchAllCommentsByBlogQuery } from "../../../redux/api/commentApi";
import { motion } from "motion/react";

const SavedBlogs = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: savedData,
    isLoading,
    isError,
    error,
  } = useFetchSavedBlogsQuery(userInfo?._id);

  const savedBlogs = Array.isArray(savedData?.savedBlogs)
    ? savedData.savedBlogs
    : [];

  const { data: comments = [] } = useFetchAllCommentsByBlogQuery(
    savedBlogs.map((blog) => blog._id),
    {
      skip: savedBlogs.length === 0,
    },
  );

  const commentsByBlogId = comments.reduce((acc, comment) => {
    const blogId = comment.blog?._id || comment.blog;
    if (!acc[blogId]) acc[blogId] = { comments: 0, replies: 0 };
    acc[blogId].comments += 1;
    acc[blogId].replies += Array.isArray(comment.replies)
      ? comment.replies.length
      : 0;
    return acc;
  }, {});

  if (isLoading)
    return (
      <p className="text-center text-lg text-gray-600 dark:text-gray-300">
        Loading saved blogs...
      </p>
    );

  if (isError)
    return (
      <p className="text-center text-red-500">
        Error: {error?.data?.message || error.message}
      </p>
    );

  if (savedBlogs.length === 0) {
    return <p className="text-center text-gray-500">No saved blogs found.</p>;
  }

  return (
    <div className="mx-auto mt-10 max-w-6xl rounded bg-white p-6 shadow-md dark:bg-neutral-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-neutral-100">
        Your Saved Blogs{" "}
        <span className="text-primary">({savedBlogs.length})</span>
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {savedBlogs.map((blog, index) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition dark:border-neutral-700 dark:bg-neutral-900"
          >
            <img
              src={blog.blogImage?.url || "/default-blog.jpg"}
              alt={blog.title}
              className="mb-3 h-48 w-full rounded object-cover"
            />

            <Link
              to={`/user-profile/${blog.author?._id}`}
              className="mb-3 flex items-center gap-2 hover:underline"
            >
              <img
                src={blog.author?.avatar?.url}
                alt={blog.author?.userName}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {blog.author?.userName}
              </span>
            </Link>

            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {blog.title}
            </h3>
            <p className="mb-3 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
              {blog.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="space-x-3">
                <span>❤️ {blog.likes?.length || 0}</span>
                <span>👁️ {blog.views || 0}</span>
                <span>
                  💬{" "}
                  {commentsByBlogId[blog._id]?.comments +
                    commentsByBlogId[blog._id]?.replies || 0}
                </span>
              </div>
              <SaveButton blogId={blog._id} />
            </div>

            <Link
              to={`/blog/${blog._id}`}
              className="mt-3 inline-block text-indigo-500 hover:underline"
            >
              Read More →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SavedBlogs;
