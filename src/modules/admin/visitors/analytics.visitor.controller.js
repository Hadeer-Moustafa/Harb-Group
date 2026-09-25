import { catchError } from "../../../utils/catchError.js";
import { WeeklyVisit } from "../../../../DB/models/admin/weeklyVisit.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const resetWeeklyVisitors = catchError(async (req,res,next) => {
    await WeeklyVisit.deleteMany({});
    return res.status(204).send();
});

export const setWeeklyVisits = catchError(async (req, res ,next) => {
    const visitorId = req.body.visitorId;
    if (!visitorId) {
        return next({
      statusCode: 400,
      message: "Visitor ID is required",
      errors: [
        {
          code: "INVALID_VISITOR_ID",
          message: "Invalid visitor ID",
          field: "visitorId",
          details: "The provided visitor ID is invalid.",
        },
      ],
    });
    }
   await WeeklyVisit.updateOne(
      { visitorId },
      { $setOnInsert: { visitorId, createdAt: new Date() } },
      { upsert: true }
    );
    return sendSuccess(res, 201, "Visitor added successfully");
});

export const getWeeklyVisits = catchError(async (req, res) => {
  const weeklyVisits = await WeeklyVisit.countDocuments();
    return sendSuccess(res, 200, "Weekly visits retrieved successfully", { count: weeklyVisits });
});
