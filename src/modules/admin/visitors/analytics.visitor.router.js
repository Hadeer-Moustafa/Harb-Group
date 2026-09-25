import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import {resetWeeklyVisitors, setWeeklyVisits , getWeeklyVisits} from "./analytics.visitor.controller.js";
import { visitorIdValSchema } from "./analytics.visitor.validation.js";
import { validate } from "../../../middleware/validate.schema.js";
import { cronJobsAuthMiddleware } from "../../../middleware/cronJobsAuth.middleware.js";

const router = Router();

// reset weekly visitors
router.delete("/reset-weekly-visitors", cronJobsAuthMiddleware, resetWeeklyVisitors);

//set visitor 
router.post("/set-visitor", validate(visitorIdValSchema), setWeeklyVisits);

//get weekly visits
router.get("/get-weekly-visitors", isAuthenticated , getWeeklyVisits);

export const visitorAnalyticsRouter = router;