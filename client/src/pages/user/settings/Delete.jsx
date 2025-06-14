import React, { useState } from "react";
import toast from "react-hot-toast";

const Delete = ({ deleteUser }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(); // async function passed via props
      toast.success("Account deleted successfully.");
      // Optional: Redirect or cleanup here
    } catch (error) {
      toast.error("Failed to delete account.");
      console.error(error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-lg bg-neutral-50 p-6 shadow-md dark:bg-neutral-800">
      <h2 className="mb-2 text-xl font-semibold text-red-600">
        Delete Account
      </h2>
      <p className="mb-4 text-neutral-500">
        Deleting your account is permanent and cannot be undone. Proceed with
        caution.
      </p>

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-md bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
        >
          Delete My Account
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-red-500">
            Are you sure you want to permanently delete your account?
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Yes, delete it"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-md border border-gray-300 px-4 py-2 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delete;
