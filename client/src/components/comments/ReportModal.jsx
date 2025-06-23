import { useState } from "react";

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason) return;
    onSubmit(reason);
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded bg-white p-6 shadow-lg dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold text-neutral-800 dark:text-white">
          Report Comment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Select a reason:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full rounded border border-neutral-300 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              required
            >
              <option value="">-- Choose --</option>
              <option value="spam">Spam</option>
              <option value="abuse">Abuse</option>
              <option value="off-topic">Off-topic</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-neutral-200 px-3 py-1 text-sm hover:bg-neutral-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
