import {
  useToggleSaveBlogMutation,
  useFetchSavedBlogsQuery,
} from "../redux/api/userApi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Bookmark, BookmarkIcon } from "lucide-react";

const SaveButton = ({ blogId }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [toggleSave, { isLoading: isToggling }] = useToggleSaveBlogMutation();

  const { data: savedBlogsData, refetch } = useFetchSavedBlogsQuery(
    userInfo?._id,
    {
      skip: !userInfo,
    },
  );
  const savedBlogs = Array.isArray(savedBlogsData?.savedBlogs)
    ? savedBlogsData.savedBlogs
    : [];

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (Array.isArray(savedBlogs) && blogId) {
      setSaved(savedBlogs.some((blog) => blog._id === blogId));
    } else {
      setSaved(false);
    }
  }, [savedBlogs, blogId]);

  const handleToggleSave = async () => {
    try {
      await toggleSave(blogId).unwrap();
      await refetch();
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  if (!userInfo) return null;

  return (
    <button
      onClick={handleToggleSave}
      title={saved ? "Unsave this blog" : "Save this blog"}
      disabled={isToggling}
    >
      {saved ? (
        <Bookmark fill="currentColor" className="text-primary" />
      ) : (
        <Bookmark />
      )}
    </button>
  );
};

export default SaveButton;
