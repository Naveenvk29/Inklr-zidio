import React from "react";

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded bg-white p-4 text-center shadow dark:bg-neutral-700">
      <p className="text-lg font-semibold">{label}</p>
      <p className="text-2xl">{value}</p>
    </div>
  );
};

export default StatCard;
