import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const UserRowCard = ({ user, isBanned, onBan, onRoleToggle, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-4 rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar?.url || "/default-avatar.png"}
            className="h-10 w-10 rounded-full object-cover"
            alt="avatar"
          />
          <div>
            <p className="font-semibold text-neutral-800 dark:text-white">
              {user.fullName.firstName} {user.fullName.lastName}
            </p>
            <p className="text-sm text-neutral-500">@{user.userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`rounded-full px-2 py-1 text-sm font-medium ${
              isBanned
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
            }`}
          >
            {isBanned ? "Banned" : "Active"}
          </span>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {user.role}
          </span>

          {expanded ? (
            <ChevronUp size={18} className="text-neutral-500" />
          ) : (
            <ChevronDown size={18} className="text-neutral-500" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-700">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <button
              onClick={() => onBan(user._id)}
              className="rounded bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600"
            >
              {isBanned ? "Unban User" : "Ban User"}
            </button>
            <button
              onClick={() => onRoleToggle(user)}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
            >
              {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
            </button>
            <button
              onClick={() => onDelete(user._id)}
              className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            >
              Delete User
            </button>
            <button
              onClick={() =>
                (window.location.href = `/user-profile/${user._id}`)
              }
              className="rounded bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-800"
            >
              View Posts
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRowCard;
