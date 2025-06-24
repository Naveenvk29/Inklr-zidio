import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [showReplies, setShowReplies] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportComment] = useReportCommentMutation();
  const navigate = useNavigate();

  const isOwnComment = currentUserId === comment.user._id;
  const isUserLoggedIn = Boolean(currentUserId);

  const handleReportSubmit = async (reason) => {
    try {
      await reportComment({ id: comment._id, reason }).unwrap();
      toast.success("Reported successfully");
    } catch (error) {
      const errorMessage = error?.data?.error || "Failed to report";
      if (errorMessage.toLowerCase().includes("already reported")) {
        toast.error("You have already reported this comment.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleReplyClick = () => {
    if (!isUserLoggedIn) {
      navigate(
        `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    setIsReplying((prev) => !prev);
  };

  const handleReportClick = () => {
    if (!isUserLoggedIn) {
      navigate(
        `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    setIsReportOpen(true);
  };

  return (
    <div
      className="mb-4 pb-2 dark:text-neutral-500"
      style={{ marginLeft: `${depth * 20}px` }}
    >
      <div className="flex justify-between">
        <div className="flex-1 px-3 py-1">
          <Link
            to={`/user-profile/${comment.user._id}`}
            className="flex items-center gap-2"
          >
            <img
              src={comment.user.avatar?.url}
              alt={comment.user.userName}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-neutral-500 hover:text-neutral-900 hover:dark:text-neutral-300">
              {comment.user.userName}
            </span>
          </Link>

          <div className="mt-1 flex items-center gap-4">
            <p className="text-md font-semibold dark:text-neutral-100">
              {comment.comment}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(comment.createdAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <button
              onClick={handleReplyClick}
              className="text-blue-500 hover:underline"
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>

            {!isOwnComment && (
              <button
                onClick={handleReportClick}
                className="text-red-500 hover:underline"
              >
                Report
              </button>
            )}

            {isOwnComment && isUserLoggedIn && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            )}

            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies((prev) => !prev)}
                className="text-gray-500 hover:underline"
              >
                {showReplies
                  ? "Hide Replies"
                  : `Show Replies (${comment.replies.length})`}
              </button>
            )}
          </div>

          {isReplying && isUserLoggedIn && (
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

          {showReplies && comment.replies?.length > 0 && (
            <div className="mt-2 space-y-2">
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
      </div>

      {isReportOpen && (
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          onSubmit={(reason) => {
            handleReportSubmit(reason);
            setIsReportOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default CommentItem;
