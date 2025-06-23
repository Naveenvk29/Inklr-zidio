import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useFetchAllCommentsByBlogQuery,
} from "../../redux/api/commentApi";
import { useSelector } from "react-redux";
import CommentForm from "./CommentForm";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";

const CommentSection = ({ blogId }) => {
  const [addComment] = useAddCommentMutation();
  const { data: comments = [] } = useFetchAllCommentsByBlogQuery(blogId);
  const [deleteComment] = useDeleteCommentMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleAddComment = async (text, parentComment = null) => {
    try {
      await addComment({ blogId, comment: text, parentComment });
      toast.success("Comment posted");
    } catch (error) {
      console.log(error);
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

  return (
    <div className="mt-1">
      <h3 className="mb-4 text-xl font-extrabold text-neutral-950 dark:text-neutral-100">
        Comments
      </h3>
      <CommentForm onSubmit={(text) => handleAddComment(text)} />
      <div className="mt-4 space-y-4">
        {comments.length ? (
          comments.map((comment, idx) => (
            <CommentItem
              key={idx}
              comment={comment}
              currentUserId={userInfo?.user?.id}
              onReply={(parentCommentId, text) =>
                handleAddComment(text, parentCommentId)
              }
              onDelete={handleDelete}
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
