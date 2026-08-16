import Joi from "joi";

const phoneRegex = /^\+?(?:[ ]*\d){7,15}[ ]*$/;

export const updateCompanyInfoSchema = Joi.object({
  nameAr: Joi.string().trim().max(100).required().messages({
    "string.base": "Arabic company name must be a string",
    "string.empty": "Arabic company name can not be empty",
    "string.max": "Arabic company name must not exceed 100 characters",
    "any.required": "Arabic company name is a required field",
  }),

  nameEn: Joi.string().trim().max(100).required().messages({
    "string.base": "English company name must be a string",
    "string.empty": "English company name can not be empty",
    "string.max": "English company name must not exceed 100 characters",
    "any.required": "English company name is a required field",
  }),

  descriptionAr: Joi.string().trim().max(1000).optional().messages({
    "string.base": "Arabic description must be a string",
    "string.max": "Arabic description must not exceed 1000 characters",
  }),

  descriptionEn: Joi.string().trim().max(1000).optional().messages({
    "string.base": "English description must be a string",
    "string.max": "English description must not exceed 1000 characters",
  }),

  address: Joi.string().trim().max(200).optional().messages({
    "string.base": "Address must be a string",
    "string.max": "Address must not exceed 200 characters",
  }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Please provide a valid email address",
    }),

  phoneNumbers: Joi.array()
    .items(
      Joi.object({
        number: Joi.string()
          .trim()
          .max(20)
          .pattern(phoneRegex)
          .required()
          .messages({
            "string.base": "Phone number must be a string",
            "string.empty": "Phone number is required",
            "string.max": "Phone number must not exceed 20 characters",
            "string.pattern.base": "Please provide a valid phone number format",
            "any.required": "Phone number is required",
          }),
        label: Joi.string().trim().max(50).optional().messages({
          "string.base": "Phone label must be a string",
          "string.max": "Phone label must not exceed 50 characters",
        }),
      }),
    )
    .default([])
    .messages({
      "array.base": "Phone numbers must be an array of objects",
    }),

  googleMapsUrl: Joi.string().trim().uri().optional().messages({
    "string.base": "Google Maps URL must be a string",
    "string.uri": "Please provide a valid Google Maps URL",
  }),

  workingHours: Joi.string().trim().max(200).optional().messages({
    "string.base": "Working hours must be a string",
    "string.max": "Working hours must not exceed 200 characters",
  }),

  socialMediaLinks: Joi.object({
    facebook: Joi.string().trim().uri().optional().messages({
      "string.uri": "Please provide a valid Facebook URL",
    }),
    instagram: Joi.string().trim().uri().optional().messages({
      "string.uri": "Please provide a valid Instagram URL",
    }),
    linkedin: Joi.string().trim().uri().optional().messages({
      "string.uri": "Please provide a valid LinkedIn URL",
    }),
    twitter: Joi.string().trim().uri().optional().messages({
      "string.uri": "Please provide a valid Twitter URL",
    }),
    whatsapp: Joi.string().trim().pattern(phoneRegex).optional().messages({
      "string.pattern.base": "Please provide a valid WhatsApp phone number",
    }),
  })
    .optional()
    .messages({
      "object.base": "Social media links must be an object",
    }),
});
