import User from "../Models/userModel.js";
import Blog from "../Models/blogModel.js";
import Comment from "../Models/commentModel.js";
import { deleteUserAvatar, deleteBlogImage } from "../utils/Cloudinary.js";
import mongoose from "mongoose";

const fetchAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const banUsersCount = await User.countDocuments({ isBanned: true });
    const blogCount = await Blog.countDocuments();
    const commentCount = await Comment.countDocuments();

    res.status(200).json({
      userCount,
      adminCount,
      banUsersCount,
      blogCount,
      commentCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const modifyRoleofUserByAdmin = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const removingUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.avatar?.public_id) {
      await deleteUserAvatar(user.avatar.public_id);
    }

    const userBlogs = await Blog.find({ author: user._id });

    for (const post of userBlogs) {
      if (post.blogImage?.public_id) {
        await deleteBlogImage(post?.blogImage?.public_id);
      }
    }

    await Promise.all([
      Blog.deleteMany({ author: user._id }),
      Comment.deleteMany({ user: user._id }),
    ]);
    await user.deleteOne();

    res.status(200).json({
      message: "User and their associated content deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const fetchReportedComment = async (req, res) => {
  try {
    const comments = await Comment.find({ "reports.0": { $exists: true } })
      .populate("user", "userName fullName")
      .populate("blog", "title");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const toggleHideCommentByAdmin = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("user", "userName fullName")
      .populate("blog", "title");

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.isHidden = !comment.isHidden;
    await comment.save();

    res.status(200).json({
      message: `Comment is now ${comment.isHidden ? "hidden" : "visible"}`,
      comment,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const toggleBanUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "user not fount" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
      message: user.isBanned ? "User Banned" : "User unBanne",
      comment: { id: user._id, isBanned: user.isBanned },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const fetchBanUserbyAdmin = async (req, res) => {
  try {
    const bannedUser = await User.find({ isBanned: true });
    res.status(200).json(bannedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const deleteBlogByAdmin = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (blog.blogImage?.public_id) {
      await deleteBlogImage(blog?.blogImage?.public_id);
    }

    await Comment.deleteMany({ blog: blog._id });
    await blog.deleteOne();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const clearCommentReports = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.reports = [];
    await comment.save();

    res.status(200).json({ message: "Reports cleared successfully", comment });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getCommentAndAllReplies = async (commentId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return [];
  }

  const result = await Comment.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(commentId) } },
    {
      $graphLookup: {
        from: "comments",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentComment",
        as: "replies",
      },
    },
    {
      $project: {
        allIds: {
          $concatArrays: [
            ["$_id"],
            {
              $map: {
                input: "$replies",
                as: "reply",
                in: "$$reply._id",
              },
            },
          ],
        },
      },
    },
  ]);

  if (!result || result.length === 0) {
    return [];
  }

  return result[0].allIds;
};

const deletecommentAndReplies = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const allComments = await getCommentAndAllReplies(req.params.id);

    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { repliesCount: -1 },
      });
    }
    await Comment.deleteMany({
      _id: { $in: allComments },
    });

    res.status(200).json({
      message: "Comment and its replies deleted successfully.",
      deletedIds: allComments,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

export {
  fetchAdminStats,
  modifyRoleofUserByAdmin,
  removingUserById,
  fetchReportedComment,
  toggleHideCommentByAdmin,
  toggleBanUserByAdmin,
  fetchBanUserbyAdmin,
  deleteBlogByAdmin,
  clearCommentReports,
  deletecommentAndReplies,
};
