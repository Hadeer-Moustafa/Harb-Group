import { Router } from "express";
import { validate } from "../../../middleware/validate.schema.js";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import {
  getMessagesQuerySchema,
  messageIdValSchema,
} from "./contact.validation.js";
import {
  getAllMessages,
  getMessageDetails,
  deleteMessage,
} from "./contact.controller.js";
const router = Router();

// get all messages
router.get(
  "/",
  isAuthenticated,
  validate(getMessagesQuerySchema),
  getAllMessages,
);
//get message details
router.get(
  "/:messageId",
  isAuthenticated,
  validate(messageIdValSchema),
  getMessageDetails,
);
// delete message
router.delete(
  "/:messageId",
  isAuthenticated,
  validate(messageIdValSchema),
  deleteMessage,
);
export default router;
