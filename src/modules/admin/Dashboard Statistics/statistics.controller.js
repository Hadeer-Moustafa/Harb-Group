import { catchError } from "../../../utils/catchError.js";
import { Products } from "../../../../DB/models/admin/product.model.js";
import { Projects } from "../../../../DB/models/admin/project.model.js";
import { ContactMessage } from "../../../../DB/models/admin/contactUs.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const getDashboardStatistics = catchError (async (req , res , next) => {
   const [
    totalProducts,
    totalProjects,
    totalMessages,
    unreadMessages
  ] = await Promise.all([
    Products.countDocuments(),
    Projects.countDocuments(),
    ContactMessage.countDocuments({ isDeleted: false }),
    ContactMessage.countDocuments({ isRead: false, isDeleted: false })
  ]);

  return sendSuccess(
    res,
    200,
    "Dashboard statistics retrieved successfully",
    {
      summary: {
        totalProducts,
        totalProjects,
        totalMessages,
        unreadMessages
      }
    }
  )
})