import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { validate } from "../../../middleware/validate.schema.js";
import {
  createServiceValSchema,
  serviceIdValSchema,
  updateServiceValSchema,
} from "./service.validation.js";
import {
  createService,
  updateService,
  deleteService,
  upload_updateServiceImage,
  deleteServiceImage,
} from "./service.controller.js";
import { uploadImagesArray } from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";
const router = Router();

// create service
router.post(
  "/",
  isAuthenticated,
  validate(createServiceValSchema),
  createService,
);
//update service
router.put(
  "/:serviceId",
  isAuthenticated,
  validate(updateServiceValSchema),
  updateService,
);
// delete service
router.delete(
  "/:serviceId",
  isAuthenticated,
  validate(serviceIdValSchema),
  deleteService,
);
// upload service image
router.post(
  "/:serviceId/image",
  isAuthenticated,
  validate(serviceIdValSchema),
  uploadImagesArray("image", 1, true),
  processAndUpload({ folder: "services" }),
  upload_updateServiceImage,
);
// delete service image
router.delete(
  "/:serviceId/image",
  isAuthenticated,
  validate(serviceIdValSchema),
  deleteServiceImage,
);
export default router;
