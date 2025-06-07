import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    blogImage: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    tags: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    visibility: {
      type: String,
      enum: ["me", "everyone"],
      default: "everyone",
    },
    views: {
      type: Number,

      default: 0,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
