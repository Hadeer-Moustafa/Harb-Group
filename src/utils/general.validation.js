import Joi from "joi";

export const idRule = Joi.string().trim().hex().length(24).required().messages({
  "string.hex": "Invalid ID format",
  "string.length": "ID must be 24 characters long",
  "any.required": "ID is required",
});
export const QueryValSchema = Joi.object({
  pageNumber: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().optional(),
});