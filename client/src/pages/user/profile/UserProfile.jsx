import ProfileCard from "./ProfileCard";
import Blogs from "./Blogs";
import { useGetUserByIdQuery } from "../../../redux/api/userApi";
import { useGetBlogsByUserQuery } from "../../../redux/api/blogApi";
import { useParams } from "react-router-dom";
const UserProfile = () => {
  const { id } = useParams();

  const {
    data: profile,
    isLoading: loadingProfile,
    error: errorProfile,
  } = useGetUserByIdQuery(id);

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

  if (errorProfile || errorBlogs) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-500 text-red-500">
        Failed to load data.
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProfileCard profile={profile} blog={userBlogs} isOwnProfile={false} />
      <Blogs Blogs={userBlogs} isOwnProfile={false} />
    </div>
  );
};

export default UserProfile;
