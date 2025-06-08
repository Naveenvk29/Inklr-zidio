import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Bell, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { toggleMode } from "../../redux/features/themeSlice";
import { logout } from "../../redux/features/authSlice";
import { useLogoutMutation, useGetAllUserQuery } from "../../redux/api/userApi";
import { persistor } from "../../redux/store";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { avatar, email, userName, role } = userInfo?.user || {};
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isDropDown, setIsDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allUser } = useGetAllUserQuery();
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      await persistor.purge();
      navigate("/login");
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Failed to log out", error.message);
    }
  };

  const filterUser = allUser?.filter((user) =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="sticky inset-x-0 top-2 z-[100] w-full bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-300"
        >
          🌑 <span>Inklr</span>
        </Link>

        <div className="relative w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && filterUser?.length > 0 && (
            <ul className="absolute z-50 mt-2 w-full items-start rounded-2xl bg-white shadow dark:bg-neutral-700">
              {filterUser.slice(0, 5).map((user) => (
                <li
                  key={user._id}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-600"
                  onClick={() => {
                    navigate(`/user-profile/${user._id}`);
                    setSearchTerm("");
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={user?.avatar.url}
                      alt={userName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">
                      {user?.userName}
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center space-x-5">
          {userInfo && (
            <div className="flex items-center justify-center gap-4">
              <Link
                to={"/write"}
                className="flex items-center space-x-1 text-sm"
              >
                <Edit
                  className="text-neutral-600 dark:text-neutral-300"
                  size={18}
                />
                <span className="text-neutral-600 dark:text-neutral-300">
                  Write
                </span>
              </Link>
              <Bell
                className="cursor-pointer text-neutral-600 dark:text-neutral-300"
                size={18}
                aria-label="Notifications"
              />
            </div>
          )}

          <div
            onClick={() => dispatch(toggleMode())}
            className="cursor-pointer"
          >
            {darkMode ? (
              <Sun
                size={18}
                className="text-yellow-500"
                aria-label="Light Mode"
              />
            ) : (
              <Moon
                size={18}
                className="text-neutral-600"
                aria-label="Dark Mode"
              />
            )}
          </div>

          <div className="flex items-center" ref={dropdownRef}>
            {userInfo ? (
              <div className="relative">
                <img
                  src={avatar?.url || "/default-avatar.png"}
                  alt={userName || "User"}
                  className="h-10 w-10 cursor-pointer rounded-full object-cover"
                  onClick={() => setIsDropDown(!isDropDown)}
                />
                {isDropDown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md bg-white p-4 text-sm font-medium text-neutral-800 shadow-lg dark:bg-neutral-700 dark:text-neutral-200">
                    {role === "admin" && (
                      <Link to="/admin" className="block hover:underline">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/my-profile" className="block hover:underline">
                      My Profile
                    </Link>
                    <Link to="/stats" className="block hover:underline">
                      Stats
                    </Link>
                    <Link to="/saved" className="block hover:underline">
                      Save for later
                    </Link>
                    <hr className="my-2" />
                    <Link to="/verify" className="block hover:underline">
                      Apply for verification
                    </Link>
                    <Link to="/settings" className="block hover:underline">
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                      {email}
                    </p>
                    <button
                      className="text-red-600 hover:underline dark:text-red-400"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link className="rounded-full bg-neutral-300 px-4 py-1 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100">
                  start Writing
                </Link>
                <Link
                  to="/login"
                  className="rounded-full bg-neutral-300 px-4 py-1 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
