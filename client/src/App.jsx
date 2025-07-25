import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./pages/auth/NavBar";
import socket from "./libs/socket";
import { addNotification } from "./redux/features/notificationSlice";
import { toast } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.user?._id) {
      socket.emit("register", userInfo.user._id);

      socket.on("getNotification", (data) => {
        dispatch(addNotification({ ...data, isRead: false }));
        toast.success(data.message || "New Notification");
      });
    }

    return () => {
      socket.off("getNotification");
    };
  }, [userInfo, dispatch]);

  return (
    <>
      <Toaster />
      <NavBar />
      <Outlet />
    </>
  );
};

export default App;
