import { catchError } from "../../../utils/catchError.js";
import { ContactMessage } from "../../../../DB/models/admin/contactUs.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const submitMessage = catchError(async (req, res, next) => {
  const { name, email, phone, message, subject } = req.body;

 const messageData = {
    name: name,
    email: email,
    phoneNumber: phone,
    message: message,
    subject: subject ,
  };
  const newMessage = await ContactMessage.create(messageData);
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
