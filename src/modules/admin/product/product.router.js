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
import { Products } from "../../../../DB/models/admin/product.model.js";
import { IDvalidationSchema } from "../category/category.validation.js";
import {
  uploadImagesArray,
  uploadSingleFile,
} from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";
import { checkDocAndImageLimit } from "../../../middleware/checkImageLimits.js";

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
  checkDocAndImageLimit({model:Products,resourceName:"product",paramName:"productId"}),
  deleteProduct,
);
//upload images of products
router.post(
  "/:productId/images",
  isAuthenticated,
  validate(productIdValSchema),
  uploadImagesArray(),
  checkDocAndImageLimit({model:Products,resourceName:"product",paramName:"productId",maxImages:20}),
  processAndUpload({ folder: "Products" }),
  uploadProductImages,
);
//delete product image
router.delete(
  "/:productId/images/:imageId",
  isAuthenticated,
  validate(deleteProductImageValSchema),
  checkDocAndImageLimit({model:Products,resourceName:"product",paramName:"productId"}),
  deleteProductImage,
);
//upload pdf for product
router.post(
  "/:productId/pdf",
  isAuthenticated,
  validate(productIdValSchema),
  uploadSingleFile(),
  checkDocAndImageLimit({model:Products,resourceName:"product",paramName:"productId"}),
  processAndUpload({ folder: "Products" }),
  uploadProductFile,
);
// delete pdf for product
router.delete(
  "/:productId/pdf",
  isAuthenticated,
  validate(productIdValSchema),
  checkDocAndImageLimit({model:Products,resourceName:"product",paramName:"productId"}),
  deleteProductFile,
);
export default router;
