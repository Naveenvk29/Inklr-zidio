import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../../../redux/features/authSlice";

const Profile = ({ profile, updateUser, refetch }) => {
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (profile) {
      setUserName(profile.userName || "");
      setBio(profile.bio || "");
      setPreview(profile.avatar?.url || null);
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("bio", bio);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await updateUser(formData).unwrap();
      refetch();
      dispatch(updateUserInfo(res));

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-lg bg-neutral-50 p-8 shadow-lg dark:bg-neutral-800">
      <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-200">
        Edit Profile
      </h1>
      <p className="mb-6 text-neutral-500">Update your profile information</p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
      >
        <div className="space-y-6 md:col-span-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-950 dark:text-neutral-200">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full rounded-md border border-neutral-500 px-4 py-2 focus:border-neutral-200 focus:ring focus:outline-none dark:text-neutral-300"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-950 dark:text-neutral-200">
              Bio
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-none rounded-md border border-neutral-500 px-4 py-2 text-neutral-800 focus:border-neutral-200 focus:ring focus:outline-none dark:text-neutral-300"
              placeholder="Tell us about yourself"
            />
          </div>

          <button
            type="submit"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative mb-2 h-32 w-32">
            {preview ? (
              <img
                src={preview}
                alt="avatar preview"
                className="h-32 w-32 rounded-full border-4 border-blue-600 object-cover transition-transform duration-200 hover:scale-105"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border bg-gray-100 text-gray-400">
                No Avatar
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
          <p className="text-sm text-gray-500">Click image to change avatar</p>
        </div>
      </form>
    </div>
  );
};

export default Profile;
