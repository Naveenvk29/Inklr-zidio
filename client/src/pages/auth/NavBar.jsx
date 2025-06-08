import { useState, useRef, useEffect } from "react";

import { Moon, Sun, Bell, Edit, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { toggleMode, initializeTheme } from "../../redux/features/themeSlice";
import { logout } from "../../redux/features/authSlice";
import { useLogoutMutation, useGetAllUserQuery } from "../../redux/api/userApi";
import { persistor } from "../../redux/store";
import cn from "../../libs/utils";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { avatar, email, userName } = userInfo?.user || {};

  const [hovered, setHovered] = useState(null);
  const [isDropDown, setIsDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const darkMode = useSelector((state) => state.theme.darkMode);
  const { data: allUser } = useGetAllUserQuery();

  const handlelogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      await persistor.purge();
      navigate("/login");
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="fixed top-0 z-[100] w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2">
        <h1>Inklr</h1>
        {userInfo ? (
          <button onClick={handlelogout}>logout</button>
        ) : (
          <div>login</div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
