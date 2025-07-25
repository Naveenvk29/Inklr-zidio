import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store.js";

import {
  createBrowserRouter,
  createRoutesFromChildren,
  RouterProvider,
  Route,
} from "react-router-dom";

//
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import CompleteProfile from "./pages/auth/CompleteProfile.jsx";
import Explore from "./pages/home/Explore.jsx";

//
import UserPriviteRoutes from "./pages/user/UserPriviteRoutes.jsx";
import MyProfile from "./pages/user/profile/MyProfile.jsx";
import UserProfile from "./pages/user/profile/UserProfile.jsx";

import FullBlog from "./pages/user/Blog/FullBlog.jsx";
import CreateBlog from "./pages/user/Blog/CreateBlog.jsx";
import EditBlog from "./pages/user/Blog/EditBlog.jsx";
import Home from "./pages/home/Home.jsx";
import Settings from "./pages/user/settings/setting.jsx";
import Stats from "./pages/user/stats/Stats.jsx";
import SavedBlogs from "./pages/user/Blog/SavedBlogs.jsx";

//
import AdminPrivateRoute from "./pages/admin/AdminPrivateRoute.jsx";
import Dashboard from "./pages/admin/Dashboard/Dashboard.jsx";
import ForgotPassword from "./pages/auth/Forgetpassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import NotificationsPage from "./pages/auth/NotificationsPage.jsx";
const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/blog/:id" element={<FullBlog />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/send-mail" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="" element={<UserPriviteRoutes />}>
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/user-profile/:id" element={<UserProfile />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/edit-post/:id" element={<EditBlog />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/saved" element={<SavedBlogs />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/admin" element={<AdminPrivateRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
  // </StrictMode>
);
