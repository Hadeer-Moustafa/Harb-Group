import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

export const addClientValSchema = Joi.object({
  nameAr: Joi.string().trim().lowercase().min(3).max(100).required().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 100 character",
    "string.min": "name in arabic must be at least 3 character",
  }),
  nameEn: Joi.string().trim().lowercase().min(3).max(100).required().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 100 character",
    "string.min": "name in english must be at least 3 character",
  }),
  displayOrder: Joi.number().optional().positive().integer().messages({
    "number.base": "display order must be number",
    "number.integer": "display order must be integer number",
    "number.positive": "display order must be positive number",
  }),
});

export const updateClientValSchema = Joi.object({
  nameAr: Joi.string().trim().lowercase().min(3).max(100).required().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 100 character",
    "string.min": "name in arabic must be at least 3 character",
  }),
  nameEn: Joi.string().trim().lowercase().min(3).max(100).required().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 100 character",
    "string.min": "name in english must be at least 3 character",
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
