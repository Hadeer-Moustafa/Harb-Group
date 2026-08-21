import { Router } from "express";
import { companyInfo } from "./company.public.controller.js";
const router = Router();

// get company info 
router.get("/",companyInfo);

export default router