import { useState } from "react";
import { useGetAllBlogsQuery } from "../../redux/api/blogApi";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const Blogs = () => {
  const { data: blogs, isLoading: blogsLoading } = useGetAllBlogsQuery();
  const { data: categories, isLoading: categoriesLoading } =
    useFetchCategoriesQuery();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Search Input */}
      <div className="mb-8 flex items-center justify-center">
        <input
          type="text"
          placeholder="Search blog titles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 md:w-3/4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        />
      </div>

      {/* Category Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
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
            className={`rounded-lg border px-4 py-2 ${
              selectedCategory === category._id
                ? "bg-black text-white dark:bg-neutral-700 dark:text-white"
                : "bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white"
            }`}
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <AnimatePresence>
          {filteredBlogs?.map((blog) => (
            <motion.div
              key={blog._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="rounded border bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
            >
              <img
                src={blog.blogImage?.url}
                alt={blog.title}
                className="h-40 w-full rounded object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold text-neutral-950 dark:text-neutral-200">
                {blog.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                By{"  "}
                <span className="font-medium text-black dark:text-neutral-200">
                  {blog.author?.userName || "Unknown"}
                </span>{" "}
                · {new Date(blog.createdAt).toLocaleDateString()} ·{" "}
                <span className="italic">{blog.category?.name}</span>
              </p>
              <p className="mt-2 line-clamp-3 text-neutral-500">
                {blog.description}
              </p>
              <Link
                to={`/blog/${blog._id}`}
                className="mt-4 inline-block text-indigo-600"
              >
                Read more →
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBlogs?.length === 0 && (
        <p className="mt-10 text-center text-gray-500">No blogs found.</p>
      )}
    </div>
  );
};

export default Blogs;
