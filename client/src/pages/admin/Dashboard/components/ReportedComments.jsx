import React from "react";
import {
  useFetchReportedCommentsQuery,
  useToggleHideCommentMutation,
  useDeletecommentAndRepliesMutation,
  useClearCommentReportsMutation,
} from "../../../../redux/api/adminApi";

const ReportedComments = () => {
  const { data: comments, isLoading } = useFetchReportedCommentsQuery();
  const [toggleHide] = useToggleHideCommentMutation();
  const [deleteComment] = useDeletecommentAndRepliesMutation();
  const [clearReports] = useClearCommentReportsMutation();
  console.log(comments);

  if (isLoading) return <p className="text-neutral-500">Loading comments...</p>;

  return (
    <div className="my-6">
      <h2 className="mb-4 text-xl font-semibold dark:text-white">
        Reported Comments
      </h2>
      <div className="space-y-4">
        {comments?.map((comment) => (
          <div
            key={comment._id}
            className="space-y-2 rounded-lg bg-white p-4 shadow dark:bg-neutral-700"
          >
            <p className="text-neutral-800 dark:text-neutral-200">
              {comment.comment}
            </p>
            <div className="text-sm text-neutral-500">
              By: {comment.user.userName}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                onClick={() => toggleHide(comment._id)}
              >
                Toggle Hide
              </button>
              <button
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                onClick={() => deleteComment(comment._id)}
              >
                Delete
              </button>
              <button
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                onClick={() => clearReports(comment._id)}
              >
                Clear Reports
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportedComments;
