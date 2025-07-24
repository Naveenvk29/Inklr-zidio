import ProfileCard from "./ProfileCard";
import Blogs from "./Blogs";
import { useGetCurrentProfileQuery } from "../../../redux/api/userApi";
import { useGetMyBlogsQuery } from "../../../redux/api/blogApi";
import { motion } from "framer-motion";

const MyProfile = () => {
  const {
    data: profile,
    isLoading: loadingProfile,
    error: errorProfile,
  } = useGetCurrentProfileQuery();

  const {
    data: blogs,
    isLoading: loadingBlogs,
    error: errorBlogs,
  } = useGetMyBlogsQuery();

  if (loadingProfile || loadingBlogs) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-500 text-white">
        Loading profile...
      </div>
    );
  }

  if (errorProfile || errorBlogs) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-500 text-red-500">
        Failed to load data.
      </div>
    );
  }

  return (
    <motion.div
      className="w-full px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ProfileCard profile={profile} blog={blogs} isOwnProfile={true} />

      <Blogs blogs={blogs} />
    </motion.div>
  );
};

export default MyProfile;
