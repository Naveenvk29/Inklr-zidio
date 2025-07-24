import { useState, useEffect } from "react";
import {
  useEditBlogMutation,
  useDeleteBlogMutation,
  useGetBlogByIdQuery,
} from "../../../redux/api/blogApi";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApi";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";
import RichTextEditor from "../../../components/RichTextEditor";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [visibility, setVisibility] = useState("everyone");
  const [description, setDescription] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);

  const { data: blogData, isLoading: isFetchingBlogs } =
    useGetBlogByIdQuery(id);
  console.log(blogData);

  const { data: categories } = useFetchCategoriesQuery();
  const [editBlog, { isLoading: isUpdating }] = useEditBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  useEffect(() => {
    if (blogData) {
      setTitle(blogData.title);
      setDescription(blogData.description);
      setCategory(blogData.category);
      setContent(blogData.content);
      setVisibility(blogData.visibility);
      setTagsInput(blogData.tags?.join(", ") || "");
      setPreviewBlog(blogData.blogImage?.url || null);
    }
  }, [blogData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: false,
    onDropAccepted: (files) => {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be under 2MB.");
        return;
      }
      setBlogImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewBlog(reader.result);
      reader.readAsDataURL(file);
    },
    onDropRejected: () => {
      toast.error("File rejected: Only JPG/PNG/WebP under 2MB allowed.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !category || !description.trim() || !content.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));
    if (blogImage) formData.append("blogImage", blogImage);

    try {
      await editBlog({ id, blog: formData }).unwrap();
      toast.success("Blog updated successfully!");
      navigate("/my-profile");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update blog.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id).unwrap();
        toast.success("Blog deleted successfully.");
        navigate("/my-profile");
      } catch (err) {
        toast.error("Failed to delete blog.");
      }
    }
  };

  if (isFetchingBlogs) return <p>Loading blog...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 dark:text-neutral-200"
    >
      <h2 className="mb-4 text-2xl font-bold">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          {...getRootProps()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`cursor-pointer rounded border-2 border-dashed px-4 py-6 text-center ${
            isDragActive
              ? "bg-gray-100 dark:bg-neutral-800"
              : "bg-gray-100 dark:bg-neutral-800"
          }`}
        >
          <input {...getInputProps()} />
          {previewBlog ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <img
                src={previewBlog}
                alt="Preview"
                className="mx-auto h-48 rounded object-cover"
              />
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500"
                onClick={() => {
                  setBlogImage(null);
                  setPreviewBlog(null);
                }}
              >
                <XCircle size={20} />
              </button>
            </motion.div>
          ) : (
            <p>Drag & drop an image, or click to select</p>
          )}
        </motion.div>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-4 py-2"
        />
        <textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border px-4 py-2"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full rounded border px-4 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border px-4 py-2 dark:bg-neutral-800"
        >
          <option value="">Select Category</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full rounded border px-4 py-2 dark:bg-neutral-800"
        >
          <option value="everyone">Everyone</option>
          <option value="private">Private</option>
        </select>

        <RichTextEditor
          value={content}
          onChange={(value) => setContent(value)}
        />

        <div className="flex items-center justify-between">
          <motion.button
            type="submit"
            disabled={isUpdating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            {isUpdating ? "Updating..." : "Update Blog"}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded border px-4 py-2 text-red-500 hover:bg-red-50"
          >
            {isDeleting ? "Deleting..." : "Delete Blog"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditBlog;
