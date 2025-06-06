import { Router } from "express";
import {
  createCategory,
  fetchCategories,
  fetchCategorysBySlug,
  modifyCategory,
  removeCategory,
} from "../Controllers/categoryControllers.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../Middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .post(authenticate, authorizedAsAdmin, createCategory)
  .get(fetchCategories);

router
  .route("/category/:slug")
  .get(fetchCategorysBySlug)
  .put(authenticate, authorizedAsAdmin, modifyCategory)
  .delete(authenticate, authorizedAsAdmin, removeCategory);

export default router;
