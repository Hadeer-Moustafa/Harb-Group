import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

export const messageIdValSchema = Joi.object({
  messageId: idRule,
});
