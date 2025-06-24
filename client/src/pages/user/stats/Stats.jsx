import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "../../../redux/api/userApi";
import {
  useGetMyBlogsQuery,
  useGetlikeofblogQuery,
} from "../../../redux/api/blogApi";
import StatsOverview from "./StatsOverview";
import UserTable from "./UserTable";
import BlogsTable from "./BlogsTable";

const Stats = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?._id || userInfo?.user?.id;

  const { data: rawFollowers } = useGetFollowersQuery(userId);
  const { data: rawFollowings } = useGetFollowingsQuery(userId);
  const { data: rawMyBlogs } = useGetMyBlogsQuery();

  const followers = rawFollowers?.followers || [];
  const followings = rawFollowings?.following || [];
  const myBlogs = rawMyBlogs || [];

  const [view, setView] = useState("followers");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(false);

  const { data: blogLikes } = useGetlikeofblogQuery(selectedBlogId, {
    skip: !selectedBlogId,
  });

  const notFollowingBack = followers.filter(
    (f) => !followings.some((follow) => follow._id === f._id),
  );

  const openLikesModal = (blogId) => {
    selectedBlogId(blogId);
    setShowLikesModal(true);
  };

  const closeLikesModal = () => {
    selectedBlogId(null);
    setShowLikesModal(false);
  };
  const getUserList = () =>
    view === "followers"
      ? followers
      : view === "following"
        ? followings
        : notFollowingBack;

  return (
    <div className="mx-auto mt-12 max-w-6xl rounded bg-neutral-100 p-6 text-neutral-800 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] dark:bg-neutral-800 dark:text-neutral-200">
      <h2 className="mb-4 text-2xl font-bold tracking-tight capitalize">
        {userInfo.user.userName} Stats
      </h2>

      <StatsOverview
        blogs={myBlogs}
        followers={followers}
        followings={followings}
        notFollowingBack={notFollowingBack}
      />

      <div className="mb-6 flex gap-4">
        {["followers", "following", "notFollowingBack"].map((type) => (
          <button
            key={type}
            onClick={() => setView(type)}
            className={`rounded px-4 py-2 font-semibold tracking-tighter ${
              view === type
                ? "bg-blue-600 text-white"
                : "bg-neutral-200 text-neutral-800"
            }`}
          >
            {type === "followers"
              ? "Followers"
              : type === "following"
                ? "Following"
                : "Not Following Back"}
          </button>
        ))}
      </div>
      <UserTable users={getUserList()} />

      <div className="mt-10">
        <h3 className="mb-3 text-xl font-bold tracking-tight">Your Blogs</h3>
        <BlogsTable blogs={myBlogs} onOpenLikes={openLikesModal} />
      </div>
    </div>
  );
};

export default Stats;
