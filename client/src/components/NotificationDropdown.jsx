import { useSelector, useDispatch } from "react-redux";
import { markAllAsRead } from "../redux/features/notificationSlice";

const NotificationDropdown = () => {
  const { notifications, unreadCount } = useSelector(
    (state) => state.notification,
  );
  const dispatch = useDispatch();

  return (
    <div className="relative">
      <button
        onClick={() => dispatch(markAllAsRead())}
        className="relative rounded border bg-white px-3 py-2"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="absolute right-0 z-50 mt-2 max-h-80 w-72 overflow-y-auto rounded border bg-white shadow-lg">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No notifications</p>
        ) : (
          notifications.map((n, index) => (
            <div
              key={index}
              className={`border-b p-3 ${!n.isRead ? "bg-gray-100" : ""}`}
            >
              <p className="text-sm font-medium">
                {n.type === "like" && "Someone liked your blog"}
                {n.type === "comment" && "New comment on your blog"}
                {n.type === "follow" && "You got a new follower"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
