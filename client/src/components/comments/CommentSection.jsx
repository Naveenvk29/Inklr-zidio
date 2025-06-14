import CommentForm from "./CommentForm";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useFetchAllCommentsByBlogQuery,
  useReportCommentMutation,
} from "../../redux/api/commentApi";
import { useSelector } from "react-redux";

const CommentSection = ({ blogId }) => {
  const [addComment] = useAddCommentMutation();
  const { data: comments = [] } = useFetchAllCommentsByBlogQuery(blogId);
  const [deleteComment] = useDeleteCommentMutation();
  const [reportComment] = useReportCommentMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleAdd = async (text, parentComment = null) => {
    try {
      await addComment({ blogId, comment: text, parentComment }).unwrap();
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to comment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id).unwrap();
      toast.success("Comment deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleReport = async (id) => {
    try {
      await reportComment(id).unwrap();
      toast.success("Reported");
    } catch {
      toast.error("Report failed");
    }
  };

  // Flat → threaded
  const getReplies = (parentId) =>
    comments.filter((c) => c.parentComment === parentId);

  const rootComments = comments.filter((c) => !c.parentComment);

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-xl font-extrabold text-neutral-950 dark:text-neutral-100">
        Comments
      </h3>
      <CommentForm onSubmit={(text) => handleAdd(text)} />

      <div className="mt-4 space-y-4">
        {rootComments.length ? (
          rootComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={userInfo?.user?.id}
              onReply={(parentCommentId, text) =>
                handleAdd(text, parentCommentId)
              }
              onDelete={handleDelete}
              onReport={handleReport}
              getReplies={getReplies} // ✅ Only this
              depth={0}
            />
          ))
        ) : (
          <p className="text-neutral-500">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
