import CommentForm from "./CommentForm";
import toast from "react-hot-toast";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useFetchAllCommentsByBlogQuery,
  useReportCommentMutation,
} from "../../redux/api/commentApi";
import { useSelector } from "react-redux";

const CommentSection = ({ blogId }) => {
  const [addComment] = useAddCommentMutation();

  const handleAdd = async (text, parentId = null) => {
    try {
      await addComment({ blogId, comment: text, parentId }).unwrap();
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to comment");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-xl font-extrabold text-neutral-950 dark:text-neutral-100">
        Comments
      </h3>
      <CommentForm onSubmit={(text) => handleAdd(text)} />
    </div>
  );
};

export default CommentSection;
