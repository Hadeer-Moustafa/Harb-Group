import Joi from "joi";
import { idRule } from "../../../utils/general.validation.js";

export const updateHeroValSchema = Joi.object({
  heroTitleAr: Joi.string().trim().max(150).required().messages({
    "string.base": "Arabic Hero title must be a string",
    "string.empty": "Arabic Hero title can not be empty",
    "string.max": "Arabic Hero title must not exceed 150 characters",
    "any.required": "Arabic Hero title is a required field",
  }),

  heroTitleEn: Joi.string().trim().max(150).required().messages({
    "string.base": "English Hero title must be a string",
    "string.empty": "English Hero title can not be empty",
    "string.max": "English Hero title must not exceed 150 characters",
    "any.required": "English Hero title is a required field",
  }),

  heroSubtitleAr: Joi.string().trim().max(300).optional().messages({
    "string.base": "Arabic Hero subtitle must be a string",
    "string.max": "Arabic Hero subtitle must not exceed 300 characters",
  }),

  heroSubtitleEn: Joi.string().trim().max(300).optional().messages({
    "string.base": "English Hero subtitle must be a string",
    "string.max": "English Hero subtitle must not exceed 300 characters",
  }),
});

export const setFeaturedProductsValSchema = Joi.object({
  productIds: Joi.array()
    .items(
      Joi.object({
        productId: idRule,
        displayOrder: Joi.number().integer().min(1).messages({
          "number.base": "displayOrder must be a number",
          "number.integer": "displayOrder must be an integer",
          "number.min": "displayOrder must be at least 1 (1-based index)",
        }),
      }),
    )
    .min(1)
    .max(12)
    .unique("productId")
    .required()
    .messages({
      "array.base": "productIds must be an array",
      "array.min": "At least 1 featured product is required",
      "array.max": "You can feature a maximum of 12 products only",
      "array.unique": "Duplicate productId are not allowed",
      "any.required": "productIds is required",
    }),
});

export const setFeaturedProjectsValSchema = Joi.object({
  projectIds: Joi.array()
    .items(
      Joi.object({
        projectId: idRule,
        displayOrder: Joi.number().integer().min(1).messages({
          "number.base": "displayOrder must be a number",
          "number.integer": "displayOrder must be an integer",
          "number.min": "displayOrder must be at least 1 (1-based index)",
        }),
      }),
    )
    .min(1)
    .max(12)
    .unique("projectId")
    .required()
    .messages({
      "array.base": "projectIds must be an array",
      "array.min": "At least 1 featured project is required",
      "array.max": "You can feature a maximum of 12 projects only",
      "array.unique": "Duplicate projectId are not allowed",
      "any.required": "projectIds is required",
    }),
});
