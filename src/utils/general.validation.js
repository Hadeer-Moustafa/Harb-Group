import Joi from "joi";

export const idRule = Joi.string().trim().hex().length(24).required().messages({
  "string.hex": "Invalid ID format",
  "string.length": "ID must be 24 characters long",
  "any.required": "ID is required",
});
