import React from "react";
import { useFetchAdminStatsQuery } from "../../../../redux/api/adminApi";

const StatBox = ({ label, value, color }) => (
  <div
    className={`flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow dark:bg-neutral-700`}
  >
    <p className="text-sm font-bold text-neutral-500 dark:text-neutral-300">
      {label}
    </p>
    <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
  </div>
);

const StatsCard = () => {
  const { data, isLoading } = useFetchAdminStatsQuery();

  if (isLoading) return <p className="text-neutral-500">Loading stats...</p>;

  if (!data) return <p>No stats available</p>;

  return (
    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <StatBox
        label="Total Users"
        value={data.userCount}
        color="text-blue-600 dark:text-blue-400"
      />
      <StatBox
        label="Total Admins"
        value={data.adminCount}
        color="text-green-600 dark:text-green-400"
      />
      <StatBox
        label="Total Active Users"
        value={data.userCount - data.adminCount}
        color="text-red-600 dark:text-red-400"
      />
      <StatBox
        label="Banned Users"
        value={data.banUsersCount}
        color="text-red-600 dark:text-red-400"
      />
      <StatBox
        label="Total Blogs"
        value={data.blogCount}
        color="text-purple-600 dark:text-purple-400"
      />
      <StatBox
        label="Total Comments"
        value={data.commentCount}
        color="text-yellow-600 dark:text-yellow-400"
      />
    </div>
  );
};

export default StatsCard;
