import { Router } from "express";
import {
  fetchAdminStats,
  modifyRoleofUserByAdmin,
  removingUserById,
  fetchReportedComment,
  toggleHideCommentByAdmin,
  toggleBanUserByAdmin,
  fetchBanUserbyAdmin,
} from "../Controllers/adminController.js";

import {
  authenticate,
  authorizedAsAdmin,
} from "../Middleware/authMiddleware.js";

const router = Router();

router.get("/stats", authenticate, authorizedAsAdmin, fetchAdminStats);

router.patch(
  "/users/:id/role",
  authenticate,
  authorizedAsAdmin,
  modifyRoleofUserByAdmin
);
router.delete("/users/:id", authenticate, authorizedAsAdmin, removingUserById);
outer.patch(
  "/users/:id/ban",
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

export default router;
