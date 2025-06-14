import { useState, useRef, useEffect } from "react";
import CommentForm from "./CommentForm";
import { Link } from "react-router-dom";
import ReportModal from "./ReportModal";

const CommentItem = ({
  comment,
  currentUserId,
  onReply,
  onDelete,
  onReport,
  getReplies,
  depth = 0,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const dropdownRef = useRef(null);

  const isAuthor = currentUserId === comment.user._id;

  const replies = getReplies(comment._id); // ✅ This is key!

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="tex mb-4 border-b pb-2 dark:text-neutral-500"
      style={{ marginLeft: `${depth * 20}px` }}
    >
      <div className="flex justify-between">
        <div className="px-3 py-1">
          <Link
            to={`/user-profile/${comment.user._id}`}
            className="flex items-center gap-2"
          >
            <img
              src={comment.user.avatar.url}
              alt={comment.user.userName}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-neutral-400">{comment.user.userName}</span>
          </Link>
          <div className="mt-1 flex items-center gap-4">
            <p className="text-md font-semibold text-neutral-900 dark:text-neutral-100">
              {comment.comment}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(comment.createdAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="More options"
          >
            ⋮
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 rounded bg-neutral-50 p-2 text-sm shadow-lg dark:bg-neutral-800">
              {isAuthor && (
                <button
                  onClick={() => onDelete(comment._id)}
                  className="block w-full rounded px-3 py-1 text-left hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => onReport(comment._id)}
                className="block w-full px-3 py-1 text-left hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <ReportModal />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* 
      <div className="mt-2 flex gap-3 text-sm text-blue-400">
        <button onClick={() => setIsReplying(!isReplying)}>Reply</button>
      </div>

      {isReplying && (
        <div className="mt-2 ml-6">
          <CommentForm
            submitLabel="Reply"
            onSubmit={(replyText) => {
              onReply(comment._id, replyText);
              setIsReplying(false);
            }}
          />
        </div>
      )} */}

      {/* {replies.length > 0 && (
        <div className="mt-2 space-y-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              onReport={onReport}
              getReplies={getReplies}
              depth={depth + 1}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default CommentItem;
