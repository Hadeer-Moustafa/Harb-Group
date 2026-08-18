import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { validate } from "../../../middleware/validate.schema.js";
import {
  createProjectValSchema,
  updateProjectValSchema,
  projectIdValSchema,
  deleteProjectImageValSchema,
} from "./project.validation.js";
import {
  createProject,
  updateProject,
  uploadProjectImages,
  deleteProjectImage,
  deleteProject,
  getAllProjects,
} from "./project.controller.js";
import { uploadImagesArray } from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";
import { checkDocAndImageLimit } from "../../../middleware/checkImageLimits.js";
import { Projects } from "../../../../DB/models/admin/project.model.js";
import { QueryValSchema } from "../../../utils/general.validation.js";
const router = Router();
//create project
router.post(
  "/",
  isAuthenticated,
  validate(createProjectValSchema),
  createProject,
);
//update project
router.put(
  "/:projectId",
  isAuthenticated,
  validate(updateProjectValSchema),
  updateProject,
);
// upload images for project
router.post(
  "/:projectId/images",
  isAuthenticated,
  validate(projectIdValSchema),
  uploadImagesArray(),
  checkDocAndImageLimit({
    model: Projects,
    resourceName: "project",
    paramName: "projectId",
    maxImages: 30,
  }),
  processAndUpload({ folder: "Projects" }),
  uploadProjectImages,
);
//delete project image
router.delete(
  "/:projectId/images/:imageId",
  isAuthenticated,
  validate(deleteProjectImageValSchema),
  checkDocAndImageLimit({
    model: Projects,
    resourceName: "project",
    paramName: "projectId",
  }),
  deleteProjectImage,
);
// delete project
router.delete(
  "/:projectId",
  isAuthenticated,
  validate(projectIdValSchema),
  checkDocAndImageLimit({
    model: Projects,
    resourceName: "project",
    paramName: "projectId",
  }),
  deleteProject,
);
// get all projects
router.get(
  "/", 
  isAuthenticated, 
  validate(QueryValSchema), 
  getAllProjects
);
export default router;
