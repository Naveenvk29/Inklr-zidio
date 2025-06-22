import { useState } from "react";
import CommentForm from "./CommentForm";
import { useReportCommentMutation } from "../../redux/api/commentApi";
import toast from "react-hot-toast";
import ReportModal from "./ReportModal";

const CommentItem = ({
  comment,
  currentUserId,
  onReply,
  onDelete,
  depth = 0,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [reportComment] = useReportCommentMutation();
  const [isReportOpen, setIsReportOpen] = useState(false);

  const isOwnComment = currentUserId === comment.user._id;

  const handleReportSubmit = async (reason) => {
    try {
      await reportComment({ id: comment._id, reason }).unwrap();
      toast.success("Reported successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to report");
    }
  };

  return (
    <div className="relative pl-6">
      <div className="relative mb-4 ml-2 rounded-md bg-white p-4 shadow-sm dark:bg-neutral-900">
        {/* Avatar & Name */}
        <div className="mb-2 flex items-center gap-3">
          <img
            src={comment.user.avatar}
            alt={comment.user.userName}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-neutral-800 dark:text-white">
            {comment.user.userName}
          </span>
        </div>

        {/* Text */}
        <p className="mb-2 text-sm text-neutral-700 dark:text-neutral-300">
          {comment.comment}
        </p>

        {/* Date */}
        <p className="mb-2 text-xs text-neutral-400">
          {new Date(comment.createdAt).toLocaleString()}
        </p>

        {/* Actions */}
        <div className="flex gap-3 text-xs text-blue-600 dark:text-blue-400">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="hover:underline"
          >
            {isReplying ? "Cancel" : "Reply"}
          </button>
          {isOwnComment ? (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          ) : (
            <div>
              <button
                onClick={() => setIsReportOpen(true)}
                className="text-yellow-600 hover:underline"
              >
                Report
              </button>

              <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                onSubmit={handleReportSubmit}
              />
            </div>
          )}
          {comment.replies?.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:underline"
            >
              {showReplies
                ? "Hide Replies"
                : `Show Replies (${comment.replies.length})`}
            </button>
          )}
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-3">
            <CommentForm
              submitLabel="Reply"
              onSubmit={(text) => {
                onReply(comment._id, text);
                setIsReplying(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Child Comments */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
