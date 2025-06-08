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

//
import UserPriviteRoutes from "./pages/user/UserPriviteRoutes.jsx";
import MyProfile from "./pages/user/profile/MyProfile.jsx";
import UserProfile from "./pages/user/profile/UserProfile.jsx";

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      <Route path="" element={<UserPriviteRoutes />}>
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/user-profile/:id" element={<UserProfile />} />
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
