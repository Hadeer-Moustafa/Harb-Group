import Joi from "joi";

const noHtmlRegex = /^[^<>&]*$/;
const phoneRegex = /^\+?(?:[ ]*\d){7,15}[ ]*$/;

export const contactMessageValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(noHtmlRegex)
    .required()
    .messages({
      "string.empty": "Name can not be empty.",
      "string.min": "Name must be at least 3 character long.",
      "string.max": "Name cannot exceed 100 characters.",
      "string.pattern.base":
        "Name cannot contain HTML tags or script elements.",
      "any.required": "Name is required.",
    }),

  email: Joi.string().trim().email().required().trim().lowercase().messages({
    "string.empty": "Email can not be empty.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),

  phone: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .pattern(phoneRegex)
    .required()
    .messages({
      "string.empty": "Phone number can not be empty.",
      "string.min": "Phone number must be at least 7 character long.",
      "string.max": "Phone number cannot exceed 20 characters.",
      "string.pattern.base":
        "Phone number must be between 7 and 15 digits (may include '+' and spaces) only.",
      "any.required": "Phone number is required.",
    }),

  message: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .pattern(noHtmlRegex)
    .required()
    .messages({
      "string.empty": "Message can not be empty.",
      "string.min": "Message must be at least 10 characters long.",
      "string.max": "Message cannot exceed 2000 characters.",
      "string.pattern.base": "Message cannot contain HTML or script tags.",
      "any.required": "Message is required.",
    }),
  subject: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(noHtmlRegex)
    .optional()
    .messages({
      "string.empty": "Subject can not be empty.",
      "string.min": "Subject must be at least 3 character long.",
      "string.max": "Subject cannot exceed 100 characters.",
      "string.pattern.base":
        "Subject cannot contain HTML tags or script elements.",
    }),
});
