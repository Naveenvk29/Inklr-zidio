import { Router } from "express";
import {
  createABlog,
  FetchMyBlogs,
  FetchAllBlogs,
  fetchBlogById,
  fetchSpecificUserblogs,
  modifyblog,
  removeblog,
  togglelike,
  fetchBlogLikes,
} from "../Controllers/blogControllers.js";
import { upload } from "../Middleware/multerMiddleware.js";
import { authenticate } from "../Middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .post(authenticate, upload.single("blogImage"), createABlog)
  .get(FetchAllBlogs);

router.get("/my", authenticate, FetchMyBlogs);
router.get("/user/:id", fetchSpecificUserblogs);

router
  .route("/blog/:id")
  .get(fetchBlogById)
  .put(authenticate, upload.single("blogImage"), modifyblog)
  .delete(authenticate, removeblog);

router.post("/blog/:id/like", authenticate, togglelike);
router.get("/blog/:id/likes", fetchBlogLikes);

export default router;
