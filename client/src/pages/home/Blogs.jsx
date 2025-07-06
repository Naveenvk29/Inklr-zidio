import { useState } from "react";
import { useGetAllBlogsQuery } from "../../redux/api/blogApi";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FollowerPointerCard from "../../components/FollowingPointer";
import { formatDistanceToNow } from "date-fns";

const Blogs = () => {
  const { data: blogs, isLoading: blogsLoading } = useGetAllBlogsQuery();
  const { data: categories, isLoading: categoriesLoading } =
    useFetchCategoriesQuery();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  if (blogsLoading || categoriesLoading) return <p>Loading...</p>;
  const filteredBlogs = blogs
    ?.filter((blog) =>
      selectedCategory ? blog.category?._id === selectedCategory : true,
    )
    .filter((blog) => {
      const query = searchQuery.toLowerCase();
      const titleMatch = blog.title.toLowerCase().includes(query);
      const tagMatch = blog.tags
        .map((tag) => tag.toLowerCase())
        .some((tag) => tag.includes(query));
      return titleMatch || tagMatch;
    })
    .sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortOption === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortOption === "mostLiked") {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search blog titles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 md:w-3/4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="rounded-md border px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="mostLiked">Most Liked</option>
        </select>
      </div>

      <motion.div layout className="mb-6 flex flex-wrap gap-2">
        <button
          className={`rounded border px-4 py-2 ${
            !selectedCategory
              ? "bg-black text-white"
              : "bg-white text-neutral-900"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories?.map((category) => (
          <button
            key={category._id}
            className={`rounded-lg border px-4 py-2 transition-colors ${
              selectedCategory === category._id
                ? "bg-black text-white dark:bg-neutral-700 dark:text-white"
                : "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white"
            }`}
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </button>
        ))}
      </motion.div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
      >
        <AnimatePresence mode="wait">
          {filteredBlogs?.map((blog) => (
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
                role={blog.author?.role || "User"}
              >
                <div className="group rounded border bg-white p-4 shadow-lg transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="overflow-hidden rounded">
                    <img
                      src={blog.blogImage?.url}
                      alt={blog.title}
                      className="h-40 w-full rounded object-cover transition-transform duration-300 group-hover:scale-[0.98]"
                    />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
                    {blog.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    By{" "}
                    <span className="font-medium text-black dark:text-neutral-100">
                      {blog.author?.userName || "Unknown"}
                    </span>{" "}
                    ·{" "}
                    {formatDistanceToNow(new Date(blog.createdAt), {
                      addSuffix: true,
                    })}{" "}
                    · <span className="italic">{blog.category?.name}</span>
                  </p>

                  <p className="mt-2 line-clamp-3 text-neutral-500 dark:text-neutral-400">
                    {blog.description}
                  </p>

                  <Link
                    to={`/blog/${blog._id}`}
                    className="mt-4 inline-block cursor-none text-indigo-600 dark:text-indigo-400"
                  >
                    Read more →
                  </Link>
                </div>
              </FollowerPointerCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredBlogs?.length === 0 && (
        <p className="mt-10 text-center text-gray-500 dark:text-gray-400">
          No blogs found.
        </p>
      )}
    </div>
  );
};

export default Blogs;
