import { useState } from "react";
import { useResetPasswordMutation } from "../../redux/api/userApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await resetPassword({ token, newPassword }).unwrap();
      toast.success("🎉 Password reset successfully!");
      navigate("/login");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(`❌ ${err?.data?.message || "Reset failed"}`);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 px-4 dark:from-neutral-900 dark:to-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-neutral-300 bg-white p-8 text-neutral-900 shadow-xl dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
      >
        <h2 className="mb-6 text-center text-3xl font-extrabold">
          Forgot Password
        </h2>

        <div className="mb-4 flex flex-col space-y-2">
          <label className="font-semibold tracking-tight">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-md border border-neutral-400 bg-neutral-100 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-400"
          />
        </div>

        <div className="mb-6">
          <label className="font-semibold tracking-tight">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-neutral-400 bg-neutral-100 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
