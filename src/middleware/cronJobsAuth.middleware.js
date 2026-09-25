import { catchError } from "../utils/catchError.js";

export const cronJobsAuthMiddleware = catchError(async (req, res, next) => {
  const cronSecret = req.headers['x-cron-secret'];
   if (cronSecret !== process.env.CRON_SECRET) {
       return next({
      statusCode: 401,
      message: "Unauthorized access",
      errors: [
        {
          code: "INVALID_CRON_SECRET",
          message: "Invalid cron secret",
          field: "x-cron-secret",
          details: "The provided cron secret is invalid.",
        },
      ],
    });
    }
  next();
});