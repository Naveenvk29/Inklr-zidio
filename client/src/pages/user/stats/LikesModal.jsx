import { X } from "lucide-react";
import FollowButton from "../../../components/follow/FollowButton";
import { Link } from "react-router-dom";

const LikesModal = ({ show, onClose, likedBy = [] }) => {
  console.log(likedBy);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative w-xl rounded bg-white p-4 shadow dark:bg-neutral-800">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 rounded-full bg-neutral-200 p-1 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600"
        >
          <X size={18} className="text-red-500 hover:text-red-800" />
        </button>
        <h3 className="text-center text-lg font-semibold">Liked By</h3>
        <ul className="mt-2">
          {likedBy.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between border-b px-2 py-1 last:border-b-0 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <div className="flex items-center justify-center gap-2">
                <img
                  src={user.avatar.url}
                  alt={user.userName}
                  className="mr-2 h-12 w-12 rounded-full object-cover"
                />
                <Link to={`/user-profile/${user._id}`}>
                  <span>{user.userName}</span>
                </Link>
              </div>
              <FollowButton id={user._id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LikesModal;
