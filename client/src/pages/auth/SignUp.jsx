import { useState } from "react";
import { useRegisterMutation } from "../../redux/api/userApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await register({
        fullName: {
          firstName,
          lastName,
        },
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Account created!");
      navigate("/complete-profile");
    } catch (err) {
      toast.error(err?.data?.message || "⚠️ Something went wrong");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white p-5 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] dark:bg-neutral-800">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            🌑 Inklr
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
              placeholder="John"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
              placeholder="Doe"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div className="relative">
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
              placeholder="••••••••"
            />
            {showPassword ? (
              <EyeOff
                className="absolute top-9 right-3 cursor-pointer text-gray-400"
                size={18}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="absolute top-9 right-3 cursor-pointer text-gray-400"
                size={18}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div className="relative">
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
              placeholder="••••••••"
            />
            {showConfirmPassword ? (
              <EyeOff
                className="absolute top-9 right-3 cursor-pointer text-gray-400"
                size={18}
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <Eye
                className="absolute top-9 right-3 cursor-pointer text-gray-400"
                size={18}
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin" size={16} />
                Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-300">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 text-blue-600 hover:underline dark:text-blue-200"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
