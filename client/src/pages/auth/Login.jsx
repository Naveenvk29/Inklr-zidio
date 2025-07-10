import { useState } from "react";
import {
  useLoginMutation,
  useOauthLoginUserMutation,
} from "../../redux/api/userApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";
import { Loader, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { googleProvider, githubProvider, auth } from "../../libs/firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [oauthLoginUser] = useOauthLoginUserMutation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return toast.error("All fields are required");

    try {
      const res = await login({ identifier, password }).unwrap();
      dispatch(setCredentials({ ...res, rememberMe }));
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  const googleHandle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseIdToken = await result.user.getIdToken();
      const res = await oauthLoginUser({ firebaseIdToken }).unwrap();
      dispatch(setCredentials(res));
      navigate("/my-profile");
    } catch (error) {
      console.log(error);
      toast.error("Google login failed");
    }
  };

  const githubHandle = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const firebaseIdToken = await result.user.getIdToken();
      const res = await oauthLoginUser({ firebaseIdToken }).unwrap();
      dispatch(setCredentials(res));
      navigate("/my-profile");
    } catch (error) {
      console.log(error);
      toast.error("GitHub login failed");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white px-4 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-xl bg-neutral-100 p-8 shadow-md dark:bg-neutral-700/70">
        <div className="mb-8 text-center text-neutral-700 dark:text-neutral-100">
          <h1 className="text-2xl font-bold">🌑 Inklr</h1>
          <p className="text-sm">Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              Email or userName
            </label>
            <div className="relative space-y-4">
              <Mail
                className="absolute top-2.5 left-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
                placeholder="you username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <div className="relative">
              {showPass ? (
                <EyeOff
                  className="absolute top-2.5 right-3 cursor-pointer text-gray-400"
                  size={18}
                  onClick={() => setShowPass(false)}
                />
              ) : (
                <Eye
                  className="absolute top-2.5 right-3 cursor-pointer text-gray-400"
                  size={18}
                  onClick={() => setShowPass(true)}
                />
              )}
              <input
                type={showPass ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-4 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-blue-500"
                />
                Remember me
              </label>
              <Link
                to={"/send-mail"}
                className="text-sm font-medium hover:underline"
              >
                Forget password
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </div>

        <div className="my-3 flex items-center gap-4">
          <div className="h-px w-full bg-neutral-400 dark:bg-neutral-50"></div>
          <p className="w-full text-center text-sm text-neutral-500">
            Or continue with
          </p>
          <div className="h-px w-full bg-neutral-400 dark:bg-neutral-50"></div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <button
            onClick={googleHandle}
            className="w-full rounded-2xl bg-red-500 px-4 py-2 text-white"
          >
            Google
          </button>
          <button
            onClick={githubProvider}
            className="w-full rounded-2xl bg-neutral-900 px-4 py-2 text-white"
          >
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
