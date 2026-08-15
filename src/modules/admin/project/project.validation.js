import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

const currentYear = new Date().getFullYear();

export const createProjectValSchema = Joi.object({
  nameAr: Joi.string().trim().max(150).min(3).required().lowercase().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 150 character",
    "string.min": "name in arabic must be at least 3 character",
  }),
  nameEn: Joi.string().trim().max(150).min(3).required().lowercase().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 150 character",
    "string.min": "name in english must be at least 3 character",
  }),
  descriptionAr: Joi.string().trim().max(2000).optional().messages({
    "string.base": "description in arabic must be string",
    "string.empty": "description in arabic cannot be empty",
    "string.max": "description in arabic must be at most 500 character",
  }),
  descriptionEn: Joi.string().trim().max(2000).optional().messages({
    "string.base": "description in english must be string",
    "string.empty": "description in english cannot be empty",
    "string.max": "description in english must be at most 500 character",
  }),
  completionYear: Joi.number()
    .integer()
    .required()
    .min(1900)
    .max(currentYear)
    .messages({
      "number.base": "completion year must be number",
      "number.integer": "compuletion year must be integar number",
      "number.min": "completion year cannot be earlier than 1900",
      "number.max": `completion year cannot exceed the current year (${currentYear})`,
      "any.required": "completion year is required",
    }),
  clientName: Joi.string().trim().min(3).max(100).required().messages({
    "any.required": "client name is required",
    "string.base": "client name must be string",
    "string.empty": "client name cannot be empty",
    "string.max": "client name must be at most 100 character",
    "string.min": "client name must be at least 3 character",
  }),
  isfeature: Joi.boolean().default(false),
});

export const updateProjectValSchema = Joi.object({
  projectId: idRule,
  nameAr: Joi.string().trim().max(150).min(3).required().lowercase().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 150 character",
    "string.min": "name in arabic must be at least 3 character",
  }),
  nameEn: Joi.string().trim().max(150).min(3).required().lowercase().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 150 character",
    "string.min": "name in english must be at least 3 character",
  }),
  descriptionAr: Joi.string().trim().max(2000).optional().messages({
    "string.base": "description in arabic must be string",
    "string.empty": "description in arabic cannot be empty",
    "string.max": "description in arabic must be at most 500 character",
  }),
  descriptionEn: Joi.string().trim().max(2000).optional().messages({
    "string.base": "description in english must be string",
    "string.empty": "description in english cannot be empty",
    "string.max": "description in english must be at most 500 character",
  }),
  completionYear: Joi.number()
    .integer()
    .required()
    .min(1900)
    .max(currentYear)
    .messages({
      "number.base": "completion year must be number",
      "number.integer": "compuletion year must be integar number",
      "number.min": "completion year cannot be earlier than 1900",
      "number.max": `completion year cannot exceed the current year (${currentYear})`,
      "any.required": "completion year is required",
    }),
  clientName: Joi.string().trim().min(3).max(100).required().messages({
    "any.required": "client name is required",
    "string.base": "client name must be string",
    "string.empty": "client name cannot be empty",
    "string.max": "client name must be at most 100 character",
    "string.min": "client name must be at least 3 character",
  }),
  isfeature: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
});

export const projectIdValSchema = Joi.object({
  projectId: idRule,
});
