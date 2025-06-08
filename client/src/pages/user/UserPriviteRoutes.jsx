import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const UserPriviteRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo ? <Outlet /> : <Navigate replace="/login" />;
};

export default UserPriviteRoutes;
