import React, { useState } from "react";
import UserDetails from "./UserDetails";
import Profile from "./Profile";
import Password from "./Password";
import Delete from "./Delete";

import {
  useGetCurrentProfileQuery,
  useDeleteUserProfileMutation,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} from "../../../redux/api/userApi";

const Settings = () => {
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useGetCurrentProfileQuery();

  const [deleteUser] = useDeleteUserProfileMutation();
  const [updateUser] = useUpdateUserProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading profile</p>;

  const renderActiveTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Profile
            profile={profile}
            updateUser={updateUser}
            refetch={refetch}
          />
        );
      case "details":
        return <UserDetails profile={profile} updateUser={updateUser} />;
      case "password":
        return <Password changePassword={changePassword} />;
      case "delete":
        return <Delete deleteUser={deleteUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Tab Navigation */}
      <div className="mb-6 flex flex-wrap gap-4 border-b pb-2">
        {[
          { label: "Profile", value: "profile" },
          { label: "User Details", value: "details" },
          { label: "Password", value: "password" },
          { label: "Delete Account", value: "delete" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div>{renderActiveTab()}</div>
    </div>
  );
};

export default Settings;
