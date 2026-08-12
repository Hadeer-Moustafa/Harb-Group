import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import {
  createCategoryValSchema,
  IDvalidationSchema,
  updateCategoryValSchema,
} from "./category.validation.js";
import { validate } from "../../../middleware/validate.schema.js";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "./category.controller.js";

const router = Router();

// create category
router.post(
  "/",
  isAuthenticated,
  validate(createCategoryValSchema),
  createCategory,
);

//update category
router.put(
  "/:id",
  isAuthenticated,
  validate(updateCategoryValSchema),
  updateCategory,
);

//delete category
router.delete(
  "/:id",
  isAuthenticated,
  validate(IDvalidationSchema),
  deleteCategory,
);
export default router;
