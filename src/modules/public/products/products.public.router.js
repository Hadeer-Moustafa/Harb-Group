import { Router } from "express";
import { getAllProducts , getProductById} from "./products.public.controller.js";
import { validate } from "../../../middleware/validate.schema.js";
import { productIdValSchema } from "../../admin/product/product.validation.js";
const router = Router();

// get all products
router.get("/",getAllProducts);
// get product by id
router.get("/:productId",validate(productIdValSchema),getProductById);
export default router