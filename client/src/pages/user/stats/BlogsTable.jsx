import { useState, useMemo } from "react";
import { useFetchSaveCountQuery } from "../../../redux/api/userApi";
import { ThumbsUp, Eye, Bookmark } from "lucide-react";

const sortBlogs = (blogs, sortBy) => {
  switch (sortBy) {
    case "mostLiked":
      return [...blogs].sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0),
      );
    case "mostViewed":
      return [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0));
    case "newest":
      return [...blogs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    case "oldest":
      return [...blogs].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    default:
      return blogs;
  }
};

const BlogsTable = ({ blogs, onOpenLikes }) => {
  const [sortBy, setSortBy] = useState("mostLiked");
  const sortedBlogs = useMemo(() => sortBlogs(blogs, sortBy), [blogs, sortBy]);

  const { data: saveCount } = useFetchSaveCountQuery(
    blogs.map((blog) => blog._id),
    {
      skip: blogs.length === 0,
    },
  );
  const saveMap = useMemo(() => {
    const map = {};

    if (Array.isArray(saveCount)) {
      saveCount.forEach((item) => {
        map[item.blogId] = item.saveCount;
      });
    } else if (saveCount && typeof saveCount === "object") {
      map[saveCount.blogId] = saveCount.saveCount;
    }

    return map;
  }, [saveCount]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Your Blogs</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded border bg-white p-2 dark:bg-neutral-700 dark:text-neutral-100"
        >
          <option value="mostLiked">Most Liked</option>
          <option value="mostViewed">Most Viewed</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="grid gap-4">
        {sortedBlogs.map((blog) => (
          <div
            key={blog._id}
            className="rounded bg-white p-4 shadow dark:bg-neutral-700"
          >
            <div className="flex items-start gap-4">
              {blog.blogImage?.url && (
                <img
                  src={blog.blogImage.url}
                  alt={blog.title}
                  className="h-20 w-20 rounded object-cover"
                />
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{blog.title}</h4>
                  <button
                    onClick={() => onOpenLikes(blog._id)}
                    className="hover:un cursor-pointer text-sm font-medium text-blue-500"
                  >
                    View Likes
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={16} className="text-red-700" />{" "}
                    {blog.likes?.length || 0} Likes
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={16} className="text-blue-600" />{" "}
                    {blog.views || 0} Views
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark size={16} className="text-yellow-500" />
                    {saveMap[blog._id] || 0} Saves
                  </span>
                </div>
                <div className="text-xs text-neutral-400">
                  Created on: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsTable;
