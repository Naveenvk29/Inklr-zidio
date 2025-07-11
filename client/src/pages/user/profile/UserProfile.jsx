import ProfileCard from "./ProfileCard";
import Blogs from "./Blogs";
import { useGetUserByIdQuery } from "../../../redux/api/userApi";
import { useGetBlogsByUserQuery } from "../../../redux/api/blogApi";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
const UserProfile = () => {
  const { id } = useParams();

  const {
    data: profile,
    isLoading: loadingProfile,
    error: errorProfile,
  } = useGetUserByIdQuery(id, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: userBlogs,
    isLoading: loadingBlogs,
    error: errorBlogs,
  } = useGetBlogsByUserQuery(id);

  if (loadingProfile || loadingBlogs) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-500 text-white">
        Loading profile...
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-500 text-red-500">
        Failed to load data.
      </div>
    );
  }

  if (errorBlogs) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-500 text-red-500">
        Failed to load blog data.
      </div>
    );
  }

  return (
    <motion.div
      className="mt-10 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ProfileCard profile={profile} blog={userBlogs} isOwnProfile={false} />
      <Blogs blogs={userBlogs} isOwnProfile={false} />
    </motion.div>
  );
};

export default UserProfile;
