import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { validate } from "../../../middleware/validate.schema.js";
import {
  addClientValSchema,
  updateClientValSchema,
  clientIdValSchema,
} from "./client.validation.js";
import {
  addClient,
  updateClient,
  uploadClientLogo,
  deleteClientLogo,
  deleteClient,
  getAllClients
} from "./client.controller.js";
import { uploadImagesArray } from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";
import { checkDocAndImageLimit } from "../../../middleware/checkImageLimits.js";
import { Clients } from "../../../../DB/models/admin/client.model.js";
import { QueryValSchema } from "../../../utils/general.validation.js";
const router = Router();
// add client
router.post("/", isAuthenticated, validate(addClientValSchema), addClient);
//update client
router.put(
  "/:clientId",
  isAuthenticated,
  validate(updateClientValSchema),
  updateClient,
);
//upload client logo
router.post(
  "/:clientId/logo",
  isAuthenticated,
  validate(clientIdValSchema),
  checkDocAndImageLimit({
    model: Clients,
    resourceName: "client",
    paramName: "clientId",
  }),
  uploadImagesArray("logo", 1, true),
  processAndUpload({ folder: "Clients" }),
  uploadClientLogo,
);
// delete client logo
router.delete(
  "/:clientId/logo",
  isAuthenticated,
  validate(clientIdValSchema),
  checkDocAndImageLimit({
    model: Clients,
    resourceName: "client",
    paramName: "clientId",
  }),
  deleteClientLogo,
);
// delete client
router.delete(
  "/:clientId",
  isAuthenticated,
  validate(clientIdValSchema),
  checkDocAndImageLimit({
    model: Clients,
    resourceName: "client",
    paramName: "clientId",
  }),
  deleteClient,
);
// get all clients
router.get(
  "/",
  isAuthenticated,
  validate(QueryValSchema),
  getAllClients
);
export default router;
