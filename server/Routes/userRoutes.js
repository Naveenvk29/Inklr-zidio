import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  completeUserProfile,
  modityCurrentUserProfile,
  deleteCurrentUserProfile,
  fetchAllUsers,
  fetchCurrentUser,
  fetchUserById,
  getFollowers,
  getFollowing,
  toggleFollowUser,
  changeCurrentUserPassword,
  toggleSaveBlog,
  fetchSavedBlogs,
  fetchBlogSaveCount,
} from "../Controllers/userControllers.js";
import { authenticate } from "../Middleware/authMiddleware.js";
import { upload } from "../Middleware/multerMiddleware.js";

const router = Router();

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Profile completion and update
router.put(
  "/complete-profile",
  upload.single("avatar"),
  authenticate,
  completeUserProfile
);

// Profile Controllers
router
  .route("/profile")
  .get(authenticate, fetchCurrentUser)
  .put(upload.single("avatar"), authenticate, modityCurrentUserProfile)
  .delete(authenticate, deleteCurrentUserProfile)
  .patch(authenticate, changeCurrentUserPassword);
// User fetching
router.route("/").get(fetchAllUsers);
router.route("/:id").get(fetchUserById);

// Follow/Unfollow routes

router.put("/toggle-follow/:id", authenticate, toggleFollowUser);

// Get followers and following
router.get("/:id/followers", authenticate, getFollowers);
router.get("/:id/following", authenticate, getFollowing);

//
router.get("/me/saved-blogs", authenticate, fetchSavedBlogs);
router.put("/blogs/:id/toggle-save", authenticate, toggleSaveBlog);
router.get("/blogs/:id/save-count", authenticate, fetchBlogSaveCount);

export default router;
