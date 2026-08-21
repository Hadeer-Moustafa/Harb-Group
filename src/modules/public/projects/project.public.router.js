import { Router } from "express";
import { validate } from "../../../middleware/validate.schema.js";
import { projectIdValSchema } from "../../admin/project/project.validation.js";
import { getAllProjects, getProjectById } from "./project.public.controller.js";

const router = Router();

// get all projects
router.get("/", getAllProjects);
// get product by id
router.get("/:projectId", validate(projectIdValSchema), getProjectById);

export default router;
