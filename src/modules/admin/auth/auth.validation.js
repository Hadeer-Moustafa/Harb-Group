import Joi from "joi";

const phoneRegex = /^\+?(?:[ ]*\d){7,15}[ ]*$/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }), // lowercase and trim the email to transform it before validation
  password: Joi.string().min(8).max(265).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be at most 265 characters long",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }), // message for password validation
}).required();

export const updateProfileValidationSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email cannot be empty",
  }),
  name: Joi.string().min(3).max(50).trim().messages({
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be at most 50 characters long",
    "string.empty": "Name cannot be empty",
  }),
  phone: Joi.string().pattern(phoneRegex).trim().messages({
    "string.pattern.base": "Invalid phone number",
    "string.empty": "Phone number cannot be empty",
  }),
}).required();

export const changePasswordValidationSchema = Joi.object({
  currentPassword: Joi.string().trim().required().messages({
    "string.empty": "current password cannot be empty",
    "any.required": "current password is required",
  }),
  newPassword: Joi.string().trim().min(8).max(256).required().messages({
    "string.min": "new password must be at least 8 characters long",
    "string.max": "new password must be at most 256 characters long",
    "string.empty": "new password cannot be empty",
    "any.required": "new password is required",
  }),
  confirmPassword: Joi.string()
    .trim()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "string.empty": "new password cannot be empty",
      "any.only": "confirm password must match new password",
      "any.required": "confirm password is required",
    }),
}).required();
