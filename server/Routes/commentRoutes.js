import { Router } from "express";
import {
  addComment,
  reportComment,
  deleteComment,
  fetchAllCommentsByBlog,
} from "../Controllers/commentControllers.js";
import { authenticate } from "../Middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticate, addComment);
router.get("/:blogId", fetchAllCommentsByBlog);
router.post("/comment/:id/report", authenticate, reportComment);
router.delete("/comment/:id", authenticate, deleteComment);

export default router;
