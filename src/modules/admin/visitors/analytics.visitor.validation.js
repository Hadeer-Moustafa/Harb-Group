import Joi from "joi";

export const visitorIdValSchema = Joi.object({
    visitorId:Joi.string().required().trim().messages({
        "string.base": "Visitor ID must be a string",
        "any.required": "Visitor ID is required",
        "string.empty": "Visitor ID cannot be empty",
    })
})