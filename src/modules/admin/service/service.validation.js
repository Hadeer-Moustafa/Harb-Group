import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

export const createServiceValSchema = Joi.object({
  nameAr: Joi.string().lowercase().trim().min(2).max(100).required().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 100 character",
    "string.min": "name in arabic must be at least 2 character",
  }),
  nameEn: Joi.string().lowercase().trim().min(2).max(100).required().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 100 character",
    "string.min": "name in english must be at least 2 character",
  }),
  descriptionAr: Joi.string()
    .lowercase()
    .trim()
    .min(2)
    .max(500)
    .required()
    .messages({
      "any.required": "description in arabic is required",
      "string.base": "description in arabic must be string",
      "string.empty": "description in arabic cannot be empty",
      "string.max": "description in arabic must be at most 500 character",
      "string.min": "description in arabic must be at least 2 character",
    }),
  descriptionEn: Joi.string()
    .lowercase()
    .trim()
    .min(2)
    .max(500)
    .required()
    .messages({
      "any.required": "description in english is required",
      "string.base": "description in english must be string",
      "string.empty": "description in english cannot be empty",
      "string.max": "description in english must be at most 500 character",
      "string.min": "description in english must be at least 2 character",
    }),
  displayOrder: Joi.number().positive().integer().messages({
    "number.base": "display order must be number",
    "number.integer": "display order must be integer number",
    "number.positive": "display order must be positive number",
  }),
});

export const serviceIdValSchema = Joi.object({
  serviceId: idRule,
});

export const updateServiceValSchema = Joi.object({
  nameAr: Joi.string().lowercase().trim().min(2).max(100).required().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 100 character",
    "string.min": "name in arabic must be at least 2 character",
  }),
  nameEn: Joi.string().lowercase().trim().min(2).max(100).required().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 100 character",
    "string.min": "name in english must be at least 2 character",
  }),
  descriptionAr: Joi.string()
    .lowercase()
    .trim()
    .min(2)
    .max(500)
    .required()
    .messages({
      "any.required": "description in arabic is required",
      "string.base": "description in arabic must be string",
      "string.empty": "description in arabic cannot be empty",
      "string.max": "description in arabic must be at most 500 character",
      "string.min": "description in arabic must be at least 2 character",
    }),
  descriptionEn: Joi.string()
    .lowercase()
    .trim()
    .min(2)
    .max(500)
    .required()
    .messages({
      "any.required": "description in english is required",
      "string.base": "description in english must be string",
      "string.empty": "description in english cannot be empty",
      "string.max": "description in english must be at most 500 character",
      "string.min": "description in english must be at least 2 character",
    }),
  displayOrder: Joi.number().positive().integer().messages({
    "number.base": "display order must be number",
    "number.integer": "display order must be integer number",
    "number.positive": "display order must be positive number",
  }),
  serviceId: idRule,
});
