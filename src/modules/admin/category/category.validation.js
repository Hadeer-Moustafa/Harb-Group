import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";
export const createCategoryValSchema = Joi.object({
  nameAr: Joi.string().trim().min(2).max(100).required().lowercase().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.min": "name in arabic must be at least 2 character",
    "string.max": "name in arabic must be at most 100 character",
  }),
  nameEn: Joi.string().trim().min(2).max(100).required().lowercase().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.min": "name in english must be at least 2 character",
    "string.max": "name in english must be at most 100 character",
  }),
  descriptionAr: Joi.string().trim().max(500).optional().messages({
    "string.base": "description in arabic must be string",
    "string.empty": "description in arabic cannot be empty",
    "string.max": "description in arabic must be at most 500 character",
  }),
  descriptionEn: Joi.string().trim().max(500).optional().messages({
    "string.base": "description in english must be string",
    "string.empty": "description in english cannot be empty",
    "string.max": "description in english must be at most 500 character",
  }),
  displayOrder: Joi.number()
    .default(0)
    .optional()
    .positive()
    .integer()
    .messages({
      "number.base": "display order must be number",
      "number.integer": "display order must be integer number",
      "number.positive": "display order must be positive number",
    }),
}).required();

export const IDvalidationSchema = Joi.object({
  id: idRule,
}).required();

export const updateCategoryValSchema = Joi.object({
  nameAr: Joi.string().trim().min(2).max(100).required().lowercase().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.min": "name in arabic must be at least 2 character",
    "string.max": "name in arabic must be at most 100 character",
  }),
  nameEn: Joi.string().trim().min(2).max(100).required().lowercase().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.min": "name in english must be at least 2 character",
    "string.max": "name in english must be at most 100 character",
  }),
  descriptionAr: Joi.string().trim().max(500).optional().messages({
    "string.base": "description in arabic must be string",
    "string.empty": "description in arabic cannot be empty",
    "string.max": "description in arabic must be at most 500 character",
  }),
  descriptionEn: Joi.string().trim().max(500).optional().messages({
    "string.base": "description in english must be string",
    "string.empty": "description in english cannot be empty",
    "string.max": "description in english must be at most 500 character",
  }),
  displayOrder: Joi.number()
    .default(0)
    .optional()
    .positive()
    .integer()
    .messages({
      "number.base": "display order must be number",
      "number.integer": "display order must be integer number",
      "number.positive": "display order must be positive number",
    }),
  id: Joi.string()
    .trim()
    .hex() // Hexadecimal (0-9, a-f)
    .length(24) // mongo id consist of 24 hexa number or alph
    .required()
    .messages({
      "string.hex": "Invalid ID format",
      "string.length": "ID must be 24 characters long",
      "any.required": "ID is required",
    }),
}).required();

