import { useState } from "react";
import { useForgetPasswordMutation } from "../../redux/api/userApi";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sendReset, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendReset({ email }).unwrap();
      toast.success("📧 Reset link sent! Check your email.");
      setEmail("");
    } catch (err) {
      toast.error(err?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 px-4 dark:from-neutral-900 dark:to-neutral-950">
      <form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-xl border border-neutral-300 bg-white p-8 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
      >
        <h2 className="mb-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
          Forgot Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-md border border-neutral-400 bg-neutral-100 px-4 py-2 text-neutral-900 placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-400"
        />
        <button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-md bg-indigo-600 py-2 font-semibold text-white transition-colors duration-300 hover:bg-indigo-700"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
