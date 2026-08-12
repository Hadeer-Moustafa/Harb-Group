import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { validate } from "../../../middleware/validate.schema.js";
import {
  addProductValSchema,
  updateProductValSchema,
  deleteProductImageValSchema,
  productIdValSchema,
} from "./product.validation.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  uploadProductFile,
  deleteProductFile,
  deleteProductImage,
} from "./product.controller.js";
import { IDvalidationSchema } from "../category/category.validation.js";
import {
  uploadImagesArray,
  uploadSingleFile,
} from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";
import { checkProductAndImageLimit } from "../../../middleware/checkImageLimits.js";

const router = Router();

// add product
router.post("/", isAuthenticated, validate(addProductValSchema), addProduct);
// update product
router.put(
  "/:productId",
  isAuthenticated,
  validate(updateProductValSchema),
  updateProduct,
);
// delete product
router.delete(
  "/:productId",
  isAuthenticated,
  validate(productIdValSchema),
  checkProductAndImageLimit,
  deleteProduct,
);
//upload images of products
router.post(
  "/:productId/images",
  isAuthenticated,
  validate(productIdValSchema),
  uploadImagesArray(),
  checkProductAndImageLimit,
  processAndUpload({ folder: "Products" }),
  uploadProductImages,
);
//delete product image
router.delete(
  "/:productId/images/:imageId",
  isAuthenticated,
  validate(deleteProductImageValSchema),
  checkProductAndImageLimit,
  deleteProductImage,
);
//upload pdf for product
router.post(
  "/:productId/pdf",
  isAuthenticated,
  validate(productIdValSchema),
  uploadSingleFile(),
  checkProductAndImageLimit,
  processAndUpload({ folder: "Products" }),
  uploadProductFile,
);
// delete pdf for product
router.delete(
  "/:productId/pdf",
  isAuthenticated,
  validate(productIdValSchema),
  checkProductAndImageLimit,
  deleteProductFile,
);
export default router;
