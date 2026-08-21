import { Router } from "express";
import { getHomePage } from "./homePage.public.controller.js";

const router = Router();

router.get("/", getHomePage);
export default router;
