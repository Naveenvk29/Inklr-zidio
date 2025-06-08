import { useState } from "react";
import { Link } from "react-router-dom";

const visibilityOptions = ["All", "me", "everyone"];
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
          {visibilityOptions.map((option) => {
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
            </button>;
          })}
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
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-md bg-neutral-800 p-4 shadow transition hover:shadow-lg"
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
