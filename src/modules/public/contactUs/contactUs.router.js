import { Router } from "express";
import { validate } from "../../../middleware/validate.schema.js";
import { contactMessageValidationSchema } from "./contactUs.validation.js";
import { submitMessage } from "./contactUs.controller.js";
const router = Router();

// submit message
router.post("/submit", validate(contactMessageValidationSchema), submitMessage);

export default router;
