import React from "react";
import StatCard from "./StatCard";

const StatsOverview = ({ blogs, followers, followings, notFollowingBack }) => {
  const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  return (
    <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3">
      <StatCard label="Blogs" value={blogs.length} />
      <StatCard label="Total Likes" value={totalLikes} />
      <StatCard label="Views" value={totalViews} />
      <StatCard label="Followers" value={followers.length} />
      <StatCard label="Following" value={followings.length} />
      <StatCard label="Not Following Back" value={notFollowingBack.length} />
    </div>
  );
};

export default StatsOverview;
