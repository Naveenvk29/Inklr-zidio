import React from "react";
import toast, { Toaster } from "react-hot-toast";
const App = () => {
  const notify = () => toast("Here is your toast.");

  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <button
        onClick={notify}
        className="text-md font-medium py-2 px-4 bg-green-400 rounded-2xl text-white"
      >
        Make me a toast
      </button>
      <Toaster />
    </div>
  );
};

export default App;
