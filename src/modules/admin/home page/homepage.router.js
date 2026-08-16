import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import {
  getHomePageContent,
  updateHeroSection,
  uploadHeroImage,
  setFeaturedProducts,
  setFeaturedProjects,
} from "./homePage.controller.js";
import { validate } from "../../../middleware/validate.schema.js";
import {
  updateHeroValSchema,
  setFeaturedProductsValSchema,
  setFeaturedProjectsValSchema,
} from "./homePage.validation.js";
import { uploadImagesArray } from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";

const router = Router();
// get homePage content for admin
router.get("/", isAuthenticated, getHomePageContent);
//update hero  section
router.put(
  "/hero",
  isAuthenticated,
  validate(updateHeroValSchema),
  updateHeroSection,
);
// upload hero image
router.post(
  "/hero-image",
  isAuthenticated,
  uploadImagesArray("hero-image", 1, true),
  processAndUpload({ folder: "Hero" }),
  uploadHeroImage,
);
// set featured products
router.post(
  "/featured-products",
  isAuthenticated,
  validate(setFeaturedProductsValSchema),
  setFeaturedProducts,
);
// set featured projects
router.post(
  "/featured-projects",
  isAuthenticated,
  validate(setFeaturedProjectsValSchema),
  setFeaturedProjects,
);

export default router;
