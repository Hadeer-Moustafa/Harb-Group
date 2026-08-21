import Router from "express";
import { getAllServices , getserviceById} from "./services.public.controller.js";
import { validate } from "../../../middleware/validate.schema.js";
import { serviceIdValSchema } from "../../admin/service/service.validation.js";
const router = Router();

// get all services
router.get(
   "/",
   getAllServices
  );
  // get service by id
  router.get("/:serviceId", validate(serviceIdValSchema),getserviceById);

export default router;