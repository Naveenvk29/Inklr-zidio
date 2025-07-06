import { useState } from "react";
import { useCreateBlogMutation } from "../../../redux/api/blogApi";
import { useFetchCategoriesQuery } from "../../../redux/api/categoryApi";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
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
      setBlogImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewBlog(reader.result);
      reader.readAsDataURL(file);
    },
    onDropRejected: (fileRejections) => {
      alert(
        `File rejected: ${fileRejections[0].errors[0].message}. Only JPG/PNG/WebP allowed.`,
      );
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required.");
    if (!category) return toast.error("Category is required.");
    if (!description.trim()) return toast.error("Description is required.");
    if (!content.trim()) return toast.error("Content is required.");
    if (!blogImage) return toast.error("Image is required.");

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-200">
        Create New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded border-2 border-dashed px-4 py-6 text-center ${
            isDragActive
              ? "bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
              : "bg-gray-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
          }`}
        >
          <input {...getInputProps()} />
          {previewBlog ? (
            <div className="relative">
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
            </div>
          ) : (
            <p>Drag & drop an image, or click to select</p>
          )}
        </div>
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-4 py-2 text-neutral-900 dark:text-neutral-100"
        />
        <textarea
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
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
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
          className=""
        />

        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
        >
          {isLoading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
