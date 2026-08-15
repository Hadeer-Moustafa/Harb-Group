import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { validate } from "../../../middleware/validate.schema.js";
import { createProjectValSchema , updateProjectValSchema , projectIdValSchema} from "./project.validation.js";
import { createProject , updateProject} from "./project.controller.js";
import { uploadImagesArray } from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";
const router = Router();
//create project 
router.post("/",isAuthenticated,validate(createProjectValSchema),createProject);
//update project
router.put("/:projectId",isAuthenticated,validate(updateProjectValSchema),updateProject);
// upload images for project
router.post("/:projectId/images",isAuthenticated,validate(projectIdValSchema),uploadImagesArray(),processAndUpload({folder: "Projects"}))
export default router;