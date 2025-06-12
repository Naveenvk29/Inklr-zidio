import {
  useFollowMutation,
  useUnfollowMutation,
} from "../../redux/api/userApi";
import { useState, useEffect } from "react";

const FollowButton = ({ id, classname, initialIsFollow = false }) => {
  const [followUser, { isLoading: isFollowing }] = useFollowMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowMutation();

  const [localIsFollowing, setLocalIsFollowing] = useState(initialIsFollow);

  useEffect(() => {
    setLocalIsFollowing(initialIsFollow);
  }, [initialIsFollow]);

  const handleFollow = async () => {
    try {
      if (!localIsFollowing) {
        await followUser(id).unwrap();
        setLocalIsFollowing(true);
      } else {
        await unfollowUser(id).unwrap();
        setLocalIsFollowing(false);
      }
    } catch (error) {
      if (error?.data?.message === "Already following this user") {
        console.warn("User is already followed. Updating local state.");
        setLocalIsFollowing(true);
      } else if (error?.data?.message === "Not following this user") {
        console.warn("User is not followed. Updating local state.");
        setLocalIsFollowing(false);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isFollowing || isUnfollowing}
      className={classname}
    >
      {isFollowing || isUnfollowing
        ? "Processing.."
        : localIsFollowing
          ? "unfollow"
          : "follow"}
    </button>
  );
};

export default FollowButton;
