import {
  useGetFollowersQuery,
  useGetFollowingsQuery,
} from "../../../redux/api/userApi";
import { useGetMyBlogsQuery } from "../../../redux/api/blogApi";
import { useSelector } from "react-redux";

const Stats = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.user?.id || userInfo?.user?._id;

  const { data: followers } = useGetFollowersQuery(userId);
  const { data: followings } = useGetFollowingsQuery(userId);
  const { data: myBlogs } = useGetMyBlogsQuery(userId);
  const totalLikes =
    myBlogs?.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0) || 0;
  console.log(totalLikes);
  console.log(followers);
  console.log(followings);

  return (
    <div className="mx-auto max-w-7xl rounded bg-neutral-50 p-4 shadow dark:bg-neutral-800"></div>
  );
};

export default Stats;
