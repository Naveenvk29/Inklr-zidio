import { useState } from "react";
import { useCreateBlogMutation } from "../../../redux/api/blogApi";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApi";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";
import RichTextEditor from "../../../components/RichTextEditor";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [visibility, setVisibility] = useState("everyone");
  const [description, setDescription] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);

  const navigate = useNavigate();
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: false,
    onDropAccepted: (files) => {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image must be under 5MB.");
      }
      setBlogImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewBlog(reader.result);
      reader.readAsDataURL(file);
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]?.message;
      toast.error(`File rejected: ${error || "Unsupported format"}`);
    },
  });

  const parseTags = (input) =>
    input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

  const isFormValid = title && category && description && content && blogImage;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return toast.error("Please fill all required fields.");

    const tags = parseTags(tagsInput);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("visibility", visibility);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));
    formData.append("blogImage", blogImage);

    try {
      await createBlog(formData).unwrap();
      toast.success("Blog created successfully!");
      setTitle("");
      setCategory("");
      setContent("");
      setTagsInput("");
      setDescription("");
      setVisibility("everyone");
      setBlogImage(null);
      setPreviewBlog(null);
      navigate("/my-profile");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create blog");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-3xl px-4 py-8"
    >
      <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-200">
        Create New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          {...getRootProps()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`cursor-pointer rounded border-2 border-dashed px-4 py-6 text-center ${
            isDragActive
              ? "bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
              : "bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
          }`}
        >
          <input {...getInputProps()} />
          {previewBlog ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
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
          aria-label="Blog Title"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-4 py-2 text-neutral-900 dark:text-neutral-100"
        />
        <textarea
          aria-label="Short Description"
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border px-4 py-2 text-neutral-900 dark:text-neutral-100"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full rounded border px-4 py-2 text-neutral-900 dark:text-neutral-100"
        />

        <div className="flex flex-col gap-5 md:flex-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded border px-4 py-2 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="">Select Category</option>
            {categories?.length ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full rounded border px-4 py-2 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="everyone">Everyone</option>
            <option value="me">Me</option>
          </select>
        </div>

        <RichTextEditor
          value={content}
          onChange={(value) => setContent(value)}
        />

        <motion.button
          type="submit"
          disabled={isLoading || !isFormValid}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded px-6 py-2 font-semibold text-white ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {isLoading ? "Creating..." : "Create Blog"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateBlog;
