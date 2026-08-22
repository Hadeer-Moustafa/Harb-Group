import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

export const addClientValSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(3).max(100).required().messages({
    "any.required": "Client name is required",
    "string.base": "Client name must be string",
    "string.empty": "Client name cannot be empty",
    "string.max": "Client name must be at most 100 character",
    "string.min": "Client name must be at least 3 character",
  }),
  displayOrder: Joi.number().optional().positive().integer().messages({
    "number.base": "display order must be number",
    "number.integer": "display order must be integer number",
    "number.positive": "display order must be positive number",
  }),
   isActive: Joi.boolean().default(true),
});

export const updateClientValSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(3).max(100).required().messages({
    "any.required": "Client name is required",
    "string.base": "Client name must be string",
    "string.empty": "Client name cannot be empty",
    "string.max": "Client name must be at most 100 character",
    "string.min": "Client name must be at least 3 character",
  }),
  displayOrder: Joi.number().optional().positive().integer().messages({
    "number.base": "display order must be number",
    "number.integer": "display order must be integer number",
    "number.positive": "display order must be positive number",
  }),
  clientId: idRule,
  isActive: Joi.boolean().default(true),
});

export const clientIdValSchema = Joi.object({
  clientId: idRule,
});
