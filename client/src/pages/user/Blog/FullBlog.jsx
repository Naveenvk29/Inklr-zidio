import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetBlogByIdQuery } from "../../../redux/api/blogApi";
import { useSelector } from "react-redux";

const FullBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: blog, isLoading, isError } = useGetBlogByIdQuery(id);

  if (isLoading) {
    return <div className="p-6 text-white">Loading....</div>;
  }
  if (isError || !blog) {
    return <div className="p-6 text-red-400">Failed to load blog.</div>;
  }

  const {
    title,
    content,
    blogImage,
    createdAt,
    views,
    author,
    likes = [],
    description,
  } = blog;

  return (
    <div className="mx-auto mt-10 max-w-7xl px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 cursor-pointer text-sm text-blue-400 hover:underline"
      >
        ← Go Back
      </button>
      <h1 className="mb-4 text-4xl leading-tight font-bold text-neutral-800 md:text-5xl dark:text-neutral-100">
        {title}
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm dark:text-neutral-100">
        <Link
          to={`/user-profile/${author._id}`}
          className="flex cursor-pointer items-center gap-2 hover:underline"
        >
          <img
            src={author?.profilePicture?.url}
            alt={author?.userName || "Author"}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-semibold dark:text-neutral-100">
            @{author?.userName}
          </span>
        </Link>
        <p>{new Date(createdAt).toLocaleDateString()}</p>
        {author?._id === userInfo?.user?.id && (
          <Link
            to={`/edit-post/${blog._id}`}
            className="text-blue-400 hover:underline"
          >
            Edit
          </Link>
        )}
        <button className="ml-auto rounded-md bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700">
          Follow
        </button>
      </div>

      <p className="text-lg font-semibold">{description}</p>

      {blog.tags?.length > 0 && (
        <div className="my-5 flex flex-wrap gap-2">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded bg-gray-700 px-3 py-1 text-sm text-gray-200 dark:bg-neutral-100 dark:text-neutral-800"
            >
              #{tag.toString()}
            </span>
          ))}
        </div>
      )}
      {blogImage?.url && (
        <img
          src={blogImage.url}
          alt={title}
          className="mb-6 max-h-[500px] w-full rounded-md object-cover"
        />
      )}
      <div className="mb-6 flex gap-6 text-sm text-neutral-900 dark:text-neutral-100">
        <span>❤️ {likes.length} likes</span>
        <span>💬 0 comments</span>
        <span>👁️ {views} views</span>
      </div>
      <div
        className="prose prose-invert max-w-none text-lg leading-relaxed text-neutral-900 dark:text-neutral-200"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default FullBlog;
