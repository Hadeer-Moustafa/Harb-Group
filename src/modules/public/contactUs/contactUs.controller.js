import { catchError } from "../../../utils/catchError.js";
import { ContactMessage } from "../../../../DB/models/admin/contactUs.model.js";
import DOMPurify from "isomorphic-dompurify";
import { sendSuccess } from "../../../utils/successResponse.js";

export const submitMessage = catchError(async (req, res, next) => {
  const { name, email, phone, message, subject } = req.body;

  const sanitizedData = {
    name: DOMPurify.sanitize(name).trim(),
    email: DOMPurify.sanitize(email).trim(),
    phoneNumber: DOMPurify.sanitize(phone).trim(),
    message: DOMPurify.sanitize(message).trim(),
    // if subject exist sanitize it else do not make any thing
    ...(subject && { subject: DOMPurify.sanitize(subject).trim() }),
  };
  const newMessage = await ContactMessage.create(sanitizedData);
  return sendSuccess(
    res,
    201,
    "Thank you! Your message has been received. We will get back to you soon.",
    {
      messageId: newMessage._id,
      submittedAt: newMessage.createdAt,
      expectedResponseTime: "Within 24-48 hours",
    },
  );
});
