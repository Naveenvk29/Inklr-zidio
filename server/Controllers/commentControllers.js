import Comment from "../Models/commentModel.js";
import mongoose from "mongoose";
import Notification from "../Models/Notification.js";
import { sendNotification } from "../utils/socket.js";
import Blog from "../Models/blogModel.js";
const addComment = async (req, res) => {
  try {
    const { comment, blogId, parentComment } = req.body;

    const newComment = new Comment({
      comment,
      blog: blogId,
      user: req.user._id,
      parentComment: parentComment || null,
    });

    await newComment.save();

    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $inc: { replyCount: 1 },
      });
    }

    const blog = await Blog.findById(blogId).populate("author", "_id");

    if (blog && !blog.author._id.equals(req.user._id)) {
      await Notification.create({
        sender: req.user._id,
        receiver: blog.author._id,
        type: "comment",
        blog: blogId,
      });
      sendNotification(blog.author._id.toString(), {
        sender: req.user._id,
        type: "comment",
        blog: blogId,
      });
    }

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      error: "Failed to add comment",
      details: error.message,
    });
  }
};

const fetchAllCommentsByBlog = async (req, res) => {
  try {
    const comments = await Comment.aggregate([
      {
        $match: {
          blog: new mongoose.Types.ObjectId(req.params.blogId),
          parentComment: null,
          isHidden: false,
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$userId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                userName: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          ],
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "comments",
          let: { parentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$parentComment", "$$parentId"] },
                    { $eq: ["$isHidden", false] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                let: { userId: "$user" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$userId"],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      userName: 1,
                      fullName: 1,
                      avatar: 1,
                    },
                  },
                ],
                as: "user",
              },
            },
            { $unwind: "$user" },
            { $sort: { createdAt: 1 } },
          ],
          as: "replies",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch comments", details: error.message });
  }
};

const reportComment = async (req, res) => {
  try {
    const { reason } = req.body;
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const alreadyReported = comment.reports.some(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReported) {
      return res
        .status(400)
        .json({ error: "You have already reported this comment" });
    }

    comment.reports.push({ user: req.user._id, reason });

    if (comment.reports.length >= 5) {
      comment.isHidden = true;
    }

    await comment.save();

    res
      .status(200)
      .json({ message: "Comment reported", isHidden: comment.isHidden });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to report comment", details: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { replyCount: -1 },
      });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete comment", details: error.message });
  }
};

export { addComment, deleteComment, fetchAllCommentsByBlog, reportComment };
