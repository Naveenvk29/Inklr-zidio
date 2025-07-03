import React from "react";
import StatsCard from "./components/StatsCard";
import UsersCard from "./components/UsersCard";
import ReportedComments from "./components/ReportedComments";
import BlogCard from "./components/BlogCard";
import { useState } from "react";

const tabOptions = [
  { label: "Stats", value: "Stats" },
  { label: "Users", value: "Users" },
  { label: "Blogs", value: "Blogs" },
  { label: "Reported Comments", value: "Reported Comments" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Stats");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Stats":
        return <StatsCard />;
      case "Users":
        return <UsersCard />;
      case "Blogs":
        return <BlogCard />;
      case "Reported Comments":
        return <ReportedComments />;
      default:
        return <StatsCard />;
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-7xl rounded bg-neutral-50 p-6 dark:bg-neutral-900">
      <h1 className="my-2 text-2xl font-bold tracking-tighter text-neutral-950 dark:text-neutral-200">
        Admin Dashboard
      </h1>
      <div className="mb-4 flex justify-between">
        <div className="flex space-x-4">
          {tabOptions.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`text-medium border-b-2 px-4 py-2 font-medium transition ${
                activeTab === tab.value
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-neutral-500 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">{renderActiveTab()}</div>
    </div>
  );
};

export default Dashboard;
