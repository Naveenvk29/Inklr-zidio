import { useState } from "react";
import { useCompleteProfileMutation } from "../../redux/api/userApi";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [completeProfile, { isLoading }] = useCompleteProfileMutation();

  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const render = new FileReader();
      render.onloadend = () => setPreviewAvatar(render.result);
      render.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("userName", userName);
    formData.append("bio", bio);

    try {
      await completeProfile(formData).unwrap();
      navigate("/");
    } catch (error) {
      if (
        error?.data?.message &&
        error.data.message.toLowerCase().includes("username")
      ) {
        setErrorMessage("Username is already taken. Please choose another.");
      } else {
        setErrorMessage(error?.data?.message || "Something went wrong.");
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-neutral-100 p-8 shadow-md dark:bg-neutral-700/70">
        <h1 className="mb-8 text-center text-lg font-bold text-neutral-700 dark:text-neutral-100">
          Complete Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              avatar
            </label>
            <div className="flex flex-col items-center justify-center">
              {previewAvatar && (
                <img
                  src={previewAvatar}
                  alt="Preview"
                  className="mt-4 mb-5 h-32 w-32 rounded-full border-4 border-gray-300 object-center"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full border px-4 py-2 font-medium"
              />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              UserName
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            {errorMessage && (
              <div className="mb-4 text-2xl font-medium text-red-600">
                {errorMessage}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:text-white"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-500 px-5 py-3 text-white"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
