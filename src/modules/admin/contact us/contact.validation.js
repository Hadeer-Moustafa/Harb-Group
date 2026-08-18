import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

export const getMessagesQuerySchema = Joi.object({
  pageNumber: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().optional(),
});

export const messageIdValSchema = Joi.object({
  messageId: idRule,
});
