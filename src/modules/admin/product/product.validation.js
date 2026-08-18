import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

export const addProductValSchema = Joi.object({
  categoryId: Joi.string()
    .hex() // يضمن إنه Hexadecimal (0-9, a-f)
    .length(24) // mongo id consist of 24 hexa number or alph
    .required()
    .messages({
      "string.hex": "Invalid category ID format",
      "string.length": "category ID must be 24 characters long",
      "any.required": "category ID is required",
    }),
  nameAr: Joi.string().trim().max(100).min(3).required().lowercase().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 100 character",
    "string.min": "name in arabic must be at least 3 character",
  }),
  nameEn: Joi.string().trim().max(100).min(3).required().lowercase().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 100 character",
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
  displayOrder: Joi.number().optional().positive().integer().messages({
    "number.base": "display order must be number",
    "number.integer": "display order must be integer number",
    "number.positive": "display order must be positive number",
  }),
  isAvailable: Joi.boolean().default(true),
}).required();

export const updateProductValSchema = Joi.object({
  categoryId: Joi.string()
    .hex() // يضمن إنه Hexadecimal (0-9, a-f)
    .length(24) // mongo id consist of 24 hexa number or alph
    .required()
    .messages({
      "string.hex": "Invalid category ID format",
      "string.length": "category ID must be 24 characters long",
      "any.required": "category ID is required",
    }),
  nameAr: Joi.string().trim().max(100).min(3).required().lowercase().messages({
    "any.required": "name in arabic is required",
    "string.base": "name in arabic must be string",
    "string.empty": "name in arabic cannot be empty",
    "string.max": "name in arabic must be at most 100 character",
    "string.min": "name in arabic must be at least 3 character",
  }),
  nameEn: Joi.string().trim().max(100).min(3).required().lowercase().messages({
    "any.required": "name in english is required",
    "string.base": "name in english must be string",
    "string.empty": "name in english cannot be empty",
    "string.max": "name in english must be at most 100 character",
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
  displayOrder: Joi.number().optional().positive().integer().messages({
    "number.base": "display order must be number",
    "number.integer": "display order must be integer number",
    "number.positive": "display order must be positive number",
  }),
  isAvailable: Joi.boolean().default(true),
  productId: idRule,
}).required();

export const productIdValSchema = Joi.object({
  productId: idRule,
});

export const deleteProductImageValSchema = Joi.object({
  productId: idRule,
  imageId: idRule,
});

export const gatAllProductsValSchema = Joi.object({
  pageNumber: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().optional().allow(""),
  categoryId: Joi.string().trim().hex().length(24).optional().messages({
    "string.pattern.base": "Invalid category ID format",
  }),
});
