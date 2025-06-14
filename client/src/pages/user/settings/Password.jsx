import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader } from "lucide-react";

const Password = ({ changePassword }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await changePassword(password); // Make sure this is an async function
      toast.success("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-lg bg-neutral-50 p-8 shadow-md dark:bg-neutral-800">
      <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-300">
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-300">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-500 px-4 py-2 text-neutral-900 focus:border-neutral-200 focus:ring focus:outline-none dark:text-neutral-100"
              placeholder="Enter new password"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-neutral-300">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-500 px-4 py-2 text-neutral-900 focus:border-neutral-200 focus:ring focus:outline-none dark:text-neutral-100"
              placeholder="Confirm new password"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={16} /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password;
