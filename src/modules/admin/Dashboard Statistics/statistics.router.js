import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { getDashboardStatistics } from "./statistics.controller.js";

const router = Router();

//Get Dashboard Statistics
router.get("/statistics",isAuthenticated,getDashboardStatistics)
export default router