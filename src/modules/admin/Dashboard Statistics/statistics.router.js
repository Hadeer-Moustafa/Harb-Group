import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import {
  getDashboardStatistics,
  recentContactMessages,
} from "./statistics.controller.js";

const router = Router();

//Get Dashboard Statistics
router.get("/statistics", isAuthenticated, getDashboardStatistics);
// Get Recent Contact Messages
router.get("/recent-messages", isAuthenticated, recentContactMessages);

export default router;
