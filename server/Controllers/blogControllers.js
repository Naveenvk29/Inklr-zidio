import Blog from "../Models/blogModel.js";
import { uploadBlogImage, deleteBlogImage } from "../utils/Cloudinary.js";
import View from "../Models/viewModel.js";
import Notification from "../Models/Notification.js";
import { sendNotification } from "../utils/socket.js";

const createABlog = async (req, res) => {
  try {
    const { title, content, category, visibility, description } = req.body;
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (error) {
        tags = req.body.tags.split(",").map((t) => t.trim());
      }
    }
    const author = req.user.id;
    let blogImage = {};

    if (req.file) {
      const result = await uploadBlogImage(req.file);
      blogImage = result;
    }

    const blog = new Blog({
      author,
      title,
      description,
      tags,
      category,
      content,
      visibility,
      blogImage,
    });

    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const FetchAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ visibility: "everyone" })
      .populate("author", "userName avatar")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const fetchBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "userName avatar")
      .populate("category", "name");
    const uniqueViews = await View.countDocuments({ blog: blog._id });
    res.status(200).json({ ...blog.toObject(), uniqueViews });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const FetchMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const fetchSpecificUserblogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.params.id,
      visibility: "everyone",
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const modifyblog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author._id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (req.file) {
      if (blog.blogImage && blog.blogImage.public_id) {
        await deleteBlogImage(blog.blogImage.public_id);
      }
      const result = await uploadBlogImage(req.file);
      blog.postImage = result;
    }

    Object.assign(blog, req.body);

    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const removeblog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (blog.blogImage && blog.blogImage.public_id) {
      await deleteBlogImage(blog.blogImage.public_id);
    }
    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const togglelike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("likes", "userName email avatar")
      .populate("author", "_id");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userId = req.user.id.toString();
    const liked = blog.likes.some((user) => user._id.toString() === userId);

    if (liked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
      if (!blog.author._id.equals(req.user._id)) {
        await Notification.create({
          sender: req.user._id,
          receiver: blog.author._id,
          type: "like",
          blog: blog._id,
        });
        sendNotification(blog.author._id.toString(), {
          sender: req.user._id,
          type: "like",
          blog: blog._id,
        });
      }
    }

    await blog.save();
    await blog.populate("likes", "userName email avatar");

    res.status(200).json({
      message: liked ? "Unliked" : "Liked",
      likesCount: blog.likes.length,
      likedBy: blog.likes,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
const fetchBlogLikes = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "likes",
      "userName email avatar"
    );

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json({
      likesCount: blog.likes.length,
      likedBy: blog.likes,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const registerView = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const alreadyViewed = await View.findOne({
      blog: req.params.id,
      user: req.user.id,
    });

    if (!alreadyViewed) {
      await View.create({ blog: req.params.id, user: req.user.id });
      blog.views += 1;
      await blog.save();
    }

    res.status(200).json({
      message: alreadyViewed ? "Already viewed" : "New view recorded",
      views: blog.views,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export {
  createABlog,
  FetchMyBlogs,
  FetchAllBlogs,
  fetchBlogById,
  fetchSpecificUserblogs,
  modifyblog,
  removeblog,
  togglelike,
  fetchBlogLikes,
  registerView,
};
