import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const visibilityOptions = ["All", "me", "everyone"];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const Blogs = ({ blogs = [], isOwnProfile = true }) => {
  const [activeVisibility, setActiveVisibility] = useState("All");

  const filteredBlogs =
    isOwnProfile && activeVisibility !== "All"
      ? blogs.filter((blog) => blog.visibility === activeVisibility)
      : isOwnProfile
        ? blogs
        : blogs.filter((blog) => blog.visibility === "everyone");

  return (
    <div className="mx-auto max-w-[110rem] px-4 py-10">
      {isOwnProfile && (
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          {visibilityOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveVisibility(option)}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                activeVisibility === option
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-gray-300 hover:bg-neutral-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {filteredBlogs.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>
            No blogs found{isOwnProfile ? ` for "${activeVisibility}"` : ""}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredBlogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="rounded-md bg-neutral-100 p-4 shadow transition hover:shadow-lg dark:bg-neutral-800"
              >
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={
                      blog.blogImage?.url ||
                      "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg"
                    }
                    alt={blog.title}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-4">
                    <h2 className="truncate text-xl font-semibold text-gray-800 dark:text-white">
                      {blog.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 text-gray-600 dark:text-gray-300">
                      {blog.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div>Views: {blog.views ?? 0}</div>
                      <div>Likes: {blog.likes?.length ?? 0}</div>
                    </div>

                    <Link
                      to={`/blog/${blog._id}`}
                      className="mt-4 inline-block text-blue-500 hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Blogs;
