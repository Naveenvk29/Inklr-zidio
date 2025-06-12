import { useSelector } from "react-redux";
import {
  useToggleFollowMutation,
  useGetFollowingsQuery,
} from "../../redux/api/userApi";

const FollowButton = ({ id: targetUserId, className = "" }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const currentUserId = userInfo?.user?.id;
  const {
    data: followings,
    refetch: refetchFollowings,
    isLoading: loadingFollowings,
  } = useGetFollowingsQuery(currentUserId);

  const [toggleFollow, { isLoading: isToggling }] = useToggleFollowMutation();
  const followingArray = followings?.following || [];
  const isFollowing = followingArray.some((user) => user._id === targetUserId);

  const handleToggleFollow = async () => {
    try {
      await toggleFollow(targetUserId).unwrap();
      refetchFollowings();
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  if (!currentUserId || !targetUserId || loadingFollowings) {
    return <div>Follow button not ready</div>;
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isToggling}
      className={className}
    >
      {isToggling ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
