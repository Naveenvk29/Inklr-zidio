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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-start gap-2 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="w-full flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-800 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-400 dark:focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default CommentForm;
