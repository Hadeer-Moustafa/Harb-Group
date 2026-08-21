import { Router } from "express";
import { validate } from "../../../middleware/validate.schema.js";
import { clientIdValSchema } from "../../admin/client/client.validation.js";
import { getAllClients  } from "./client.public.controller.js";

const router = Router();

// get all clients
router.get("/", getAllClients);



export default router;
