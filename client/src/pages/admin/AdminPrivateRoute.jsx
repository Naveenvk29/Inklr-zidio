import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const AdminPrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo.user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate replace={"/"} />
  );
};

export default AdminPrivateRoute;
