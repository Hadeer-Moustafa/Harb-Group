import { ContactMessage } from "../../../../DB/models/admin/contactUs.model.js";
import { catchError } from "../../../utils/catchError.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const getAllMessages = catchError(async (req, res, next) => {
  const { pageNumber, pageSize, search } = req.query;

  const filter = {};

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { subject: searchRegex },
    ];
  }
  filter.isDeleted = false;
  const skip = (pageNumber - 1) * pageSize;
  const [messages, totalCount, unreadCount] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(pageSize))
      .select("-__v -isDeleted -updatedAt"),
    ContactMessage.countDocuments(filter),
    ContactMessage.countDocuments({ isRead: false }),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);
  const totlaUnReaded = await ContactMessage.find({
    isRead: false,
  }).countDocuments();
  return sendSuccess(res, 200, "Contact messages retrieved successfully", {
    messages,
    pagination: {
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
    totlaUnReaded,
  });
});

export const getMessageDetails = catchError(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await ContactMessage.findOneAndUpdate(
    { _id: messageId, isDeleted: false },
    { isRead: true, readAt: new Date().toISOString() },
    { returnDocument: "after" },
  ).select("-__v -isDeleted -updatedAt");
  if (!message) {
    return next({
      statusCode: 404,
      message: "Message not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "No message found with this ID",
        },
      ],
    });
  }
  return sendSuccess(res, 200, "Message retrieved successfully", {
    message,
  });
});

export const deleteMessage = catchError(async (req, res, next) => {
  const { messageId } = req.params;

  const message = await ContactMessage.findOneAndUpdate(
    { _id: messageId, isDeleted: false },
    { isDeleted: true },
    { returnDocument: "after" },
  ).lean();
  if (!message) {
    return next({
      statusCode: 404,
      message: "Message not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "No message found or already deleted",
        },
      ],
    });
  }
  return res.status(204).send();
});
