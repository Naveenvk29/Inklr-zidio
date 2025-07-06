import { useState, useRef, useEffect } from "react";
import { Moon, Sun, Bell, Edit, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { toggleMode } from "../../redux/features/themeSlice";
import { logout } from "../../redux/features/authSlice";
import { useLogoutMutation, useGetAllUserQuery } from "../../redux/api/userApi";
import { persistor } from "../../redux/store";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import cn from "../../libs/utils";

const NavItem = [
  { name: "Admin Dashboard", link: "/admin/dashboard" },
  { name: "My Profile", link: "/my-profile" },
  { name: "Stats", link: "/stats" },
  { name: "Save for later", link: "/saved" },
  { name: "Apply for verification", link: "/verify" },
  { name: "Settings", link: "/settings" },
];

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const user = userInfo?.user;
  const { avatar, email, userName, role, fullName } = userInfo?.user || {};

  const firstName = fullName?.firstName;
  const lastName = fullName?.lastName;
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isDropDown, setIsDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allUser } = useGetAllUserQuery();
  const dropdownRef = useRef();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  const { scrollY } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (visible !== latest > 100) {
      setVisible(latest > 100);
    }
  });
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
  const filterUser = allUser?.filter((user) => {
    const userNameMatch = user.userName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const firstNameMatch = user.fullName?.firstName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const lastNameMatch = user.fullName?.lastName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return userNameMatch || firstNameMatch || lastNameMatch;
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      className="sticky inset-x-0 top-0 z-[100] w-full"
    >
      <motion.div
        animate={{
          backdropFilter: visible ? "blue(8px)" : "",
          width: visible ? "50%" : "100%",
          boxShadow: visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          y: visible ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        style={{
          width: "850px",
        }}
        className={cn(
          "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
          visible && "bg-white/90 dark:bg-neutral-950/30",
        )}
      >
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-neutral-800 dark:text-neutral-300"
        >
          🌑 <span>Inklr</span>
        </Link>

        {userInfo && (
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
                        src={user?.avatar?.url}
                        alt={userName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-300">
                        {user?.userName
                          ? user.userName
                          : `${user.fullName.firstName} ${user.fullName.lastName}`}
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center space-x-5">
          {userInfo && (
            <div className="flex items-center justify-center gap-4">
              <Link
                to={"/create-blog"}
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
              <AnimatePresence>
                <div className="relative">
                  <img
                    src={avatar?.url || "/default-avatar.png"}
                    alt={userName || "User"}
                    className="h-10 w-10 cursor-pointer rounded-full object-cover"
                    onClick={() => setIsDropDown(!isDropDown)}
                  />
                  {isDropDown && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.1,
                        ease: "easeInOut",
                      }}
                      exit={{
                        height: 0,
                        opacity: 1,
                      }}
                      className="absolute right-0 mt-2 w-64 rounded-md bg-white p-4 text-sm font-medium text-neutral-800 shadow-lg dark:bg-neutral-700 dark:text-neutral-200"
                    >
                      {NavItem.filter(
                        (item) =>
                          item.name !== "Admin Dashboard" || role === "admin",
                      ).map((item) => (
                        <Link
                          key={item.name}
                          to={item.link || "#"}
                          className="block hover:underline"
                        >
                          {item.name}
                        </Link>
                      ))}
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
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
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
      </motion.div>
      {/* moblie */}
      <motion.div
        animate={{
          backdropFilter: visible ? "blur(8px)" : "",
          borderColor: visible ? "rgba(0,0,0,0.5)" : "transparent",
          y: visible ? 15 : 0,
          width: visible ? "90%" : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 30,
        }}
        className="mx-auto flex items-center justify-between rounded-lg px-4 py-2 lg:hidden"
      >
        <div className="text-lg font-bold text-neutral-600 dark:text-neutral-300">
          🌑 <span>Inklr</span>
        </div>
        <div>
          {mobileOpen ? (
            <X
              className="text-neutral-600 dark:text-neutral-300"
              onClick={() => setMobileOpen(false)}
            />
          ) : (
            <Menu
              className="text-neutral-600 dark:text-neutral-300"
              onClick={() => setMobileOpen(true)}
            />
          )}
        </div>
      </motion.div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 right-0 left-0 z-[90] flex flex-col space-y-4 bg-white px-6 py-4 shadow-md lg:hidden dark:bg-neutral-900"
          >
            {userInfo && (
              <>
                <div className="flex items-center space-x-3">
                  <img
                    src={avatar?.url || "/default-avatar.png"}
                    alt={userName || "User"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {userName || `${firstName} ${lastName}`}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Search users..."
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchTerm && filterUser?.length > 0 && (
                  <ul className="space-y-2 rounded-md bg-white p-2 shadow dark:bg-neutral-800">
                    {filterUser.slice(0, 5).map((user) => (
                      <li
                        key={user._id}
                        className="flex cursor-pointer items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                        onClick={() => {
                          navigate(`/user-profile/${user._id}`);
                          setSearchTerm("");
                          setMobileOpen(false);
                        }}
                      >
                        <img
                          src={user?.avatar?.url}
                          alt={user.userName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {user.userName ||
                            `${user.fullName.firstName} ${user.fullName.lastName}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {NavItem.filter(
                  (item) => item.name !== "Admin Dashboard" || role === "admin",
                ).map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="text-sm text-neutral-700 hover:underline dark:text-neutral-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <button
                  className="mt-2 text-left text-sm text-red-600 hover:underline dark:text-red-400"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}

            {!userInfo && (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-neutral-700 dark:text-neutral-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-neutral-700 dark:text-neutral-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NavBar;
