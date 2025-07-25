import FollowButton from "../../../components/follow/FollowButton";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import CountUp from "react-countup";

const ProfileCard = ({
  profile,
  blog = [],
  isOwnProfile = true,
  refetchProfile,
}) => {
  const {
    _id,
    fullName,
    userName,
    bio,
    avatar,
    followers = [],
    following = [],
  } = profile;

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <motion.div
      className="mx-auto w-full max-w-4xl rounded-lg bg-neutral-50 shadow-md dark:bg-neutral-900"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6 p-5 md:flex-row md:items-start md:justify-between">
        <motion.div
          className="shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={avatar?.url}
            alt={userName}
            className="h-36 w-36 rounded-full border-2 border-neutral-500"
          />
        </motion.div>

        <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {fullName.firstName} {fullName.lastName}
            </h1>
            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-300">
              @{userName}
            </h3>
            <p className="text-sm dark:text-neutral-500">{bio}</p>

            <motion.div
              className="mt-3 flex justify-center gap-4 md:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isOwnProfile ? (
                <>
                  <Link
                    to="/settings"
                    className="rounded bg-blue-500 px-5 py-1 text-sm font-medium text-white"
                  >
                    Edit Profile
                  </Link>
                  <button className="rounded bg-blue-500 px-5 py-1 text-sm font-medium text-white">
                    Share Profile
                  </button>
                </>
              ) : (
                <>
                  {userInfo?.user?.id !== profile._id && (
                    <FollowButton
                      id={_id}
                      className="rounded bg-blue-500 px-4 py-2 text-white"
                      onFollowChange={refetchProfile}
                    />
                  )}
                  <button className="rounded bg-blue-500 px-5 py-1 text-sm font-medium text-white">
                    Share Profile
                  </button>
                </>
              )}
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center gap-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <h2 className="mb-1 text-2xl font-bold text-neutral-950 dark:text-neutral-100">
                <CountUp end={blog.length} duration={1} />
              </h2>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Blogs
              </p>
            </div>
            <div className="text-center">
              <h2 className="mb-1 text-2xl font-bold text-neutral-950 dark:text-neutral-100">
                <CountUp end={followers.length || 0} duration={1.2} />
              </h2>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Followers
              </p>
            </div>
            <div className="text-center">
              <h2 className="mb-1 text-2xl font-bold text-neutral-950 dark:text-neutral-100">
                <CountUp end={following.length || 0} duration={1.2} />
              </h2>
              <p className="text-sm text-neutral-800 dark:text-neutral-200">
                Following
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
