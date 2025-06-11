import { useState } from "react";

const CommentForm = ({ onSubmit, submitLabel = "Comment" }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="text"
        className="w-full rounded-lg bg-neutral-400 px-4 py-1 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200"
        placeholder="Write a comment...."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="mt-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default CommentForm;
