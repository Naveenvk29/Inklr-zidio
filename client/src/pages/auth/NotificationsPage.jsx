import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { markAllAsRead } from "../../redux/features/notificationSlice";

const NotificationsPage = () => {
  const { notifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Notifications</h2>
        <button
          onClick={() => dispatch(markAllAsRead())}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          Mark all as read
        </button>
      </div>

      <ul className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-neutral-500">No notifications yet.</p>
        ) : (
          notifications.map((notif, i) => (
            <li
              key={i}
              className={`rounded-md px-4 py-2 ${
                notif.isRead
                  ? "bg-neutral-100 dark:bg-neutral-700"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              }`}
            >
              {notif.message}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationsPage;
