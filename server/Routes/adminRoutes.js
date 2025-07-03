import { Router } from "express";
import {
  fetchAdminStats,
  modifyRoleofUserByAdmin,
  removingUserById,
  fetchReportedComment,
  toggleHideCommentByAdmin,
  toggleBanUserByAdmin,
  fetchBanUserbyAdmin,
  deleteBlogByAdmin,
  clearCommentReports,
  deletecommentAndReplies,
} from "../Controllers/adminController.js";

import {
  authenticate,
  authorizedAsAdmin,
} from "../Middleware/authMiddleware.js";

const router = Router();

router.get("/stats", authenticate, authorizedAsAdmin, fetchAdminStats);

router.patch(
  "/user/:id/role",
  authenticate,
  authorizedAsAdmin,
  modifyRoleofUserByAdmin
);
router.delete("/user/:id", authenticate, authorizedAsAdmin, removingUserById);
router.patch(
  "/user/:id/ban",
  authenticate,
  authorizedAsAdmin,
  toggleBanUserByAdmin
);
router.get(
  "/banned/users",
  authenticate,
  authorizedAsAdmin,
  fetchBanUserbyAdmin
);

router.get(
  "/comments/reported",
  authenticate,
  authorizedAsAdmin,
  fetchReportedComment
);
router.patch(
  "/comments/:id/toggle-hide",
  authenticate,
  authorizedAsAdmin,
  toggleHideCommentByAdmin
);

router.delete("/blogs/:id", authenticate, authorizedAsAdmin, deleteBlogByAdmin);

router.delete(
  "/comments/:id",
  authenticate,
  authorizedAsAdmin,
  deletecommentAndReplies
);

router.patch(
  "/comments/:id/clear-reports",
  authenticate,
  authorizedAsAdmin,
  clearCommentReports
);
export default router;
