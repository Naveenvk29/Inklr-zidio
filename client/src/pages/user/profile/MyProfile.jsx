import ProfileCard from "./ProfileCard";
import Blogs from "./Blogs";
import { useGetCurrentProfileQuery } from "../../../redux/api/userApi";
import { useGetMyBlogsQuery } from "../../../redux/api/blogApi";
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
    <div className="mt-10 w-full">
      <ProfileCard profile={profile} blog={blogs} isOwnProfile={true} />
      <Blogs blogs={blogs} />
    </div>
  );
};

export default MyProfile;
