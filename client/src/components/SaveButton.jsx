import {
  useToggleSaveBlogMutation,
  useFetchSavedBlogsQuery,
} from "../redux/api/userApi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.button
      onClick={handleToggleSave}
      title={saved ? "Unsave this blog" : "Save this blog"}
      disabled={isToggling}
      whileTap={{ scale: 1.4 }}
      className="transition-colors duration-200"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={saved ? "saved" : "unsaved"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Bookmark
            className={`h-6 w-6 ${
              saved ? "fill-current text-blue-600" : "text-gray-500"
            }`}
            fill={saved ? "currentColor" : "none"}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default SaveButton;
