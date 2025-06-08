import React from "react";
import { Toaster } from "react-hot-toast";
import NavBar from "./pages/auth/NavBar";
import { Outlet } from "react-router-dom";
const App = () => {
  return (
    <>
      <Toaster />
      <NavBar />
      <div className="">
        <Outlet />
      </div>
    </>
  );
};

export default App;
