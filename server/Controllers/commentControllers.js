import Comment from "../Models/commentModel.js";

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

    res.status(201).json(newComment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add comment", details: error.message });
  }
};

const fetchAllCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({
      blog: blogId,
      parentComment: null,
      isHidden: false,
    })
      .populate("user", "userName profilePicture")
      .sort({ createdAt: -1 });

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
          isHidden: false,
        })
          .populate("user", "userName profilePicture")
          .sort({ createdAt: 1 });

        return { ...comment.toObject(), replies };
      })
    );

    res.status(200).json(commentsWithReplies);
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
