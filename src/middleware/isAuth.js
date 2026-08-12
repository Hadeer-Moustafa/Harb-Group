import jwt from "jsonwebtoken";
import { catchError } from "../Utils/catchError.js";
import { AdminUser } from "../../DB/models/admin/admin.model.js";

export const isAuthenticated = catchError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return next({
      statusCode: 401,
      message: "Authentication token is required",
      errors: [
        {
          code: "TOKEN_REQUIRED",
          message: "Authentication token is required",
          field: "token",
          details: "token must be provided in the request headers",
        },
      ],
    });
  }
  if (!token.startsWith(process.env.BEARERKEY)) {
    return next({
      statusCode: 401,
      message: "invalid token",
      errors: [
        {
          code: "INVALID_TOKEN",
          message: "invalid token",
          field: "token",
          details: "token must start with Bearer",
        },
      ],
    });
  }
  token = token.split(" ")[1];
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return next({
      statusCode: 401,
      message: "Invalid or expired token",
      errors: [
        {
          code: "INVALID_TOKEN",
          message: "Invalid or expired token",
          field: "token",
          details: "The provided token is invalid or has expired",
        },
      ],
    });
  }

  const admin = await AdminUser.findOne({
    email: payload.email,
    isActive: true,
  });
  if (!admin) {
    return next({
      statusCode: 404,
      message: "Admin user not found",
      errors: [
        {
          code: "ADMIN_NOT_FOUND",
          message: "Admin user not found",
          field: "id",
          details: "Admin user does not exist",
        },
      ],
    });
  }
  if (!admin.refreshToken) {
    return next({
      statusCode: 401,
      message: "Authentication failed",
      errors: [
        {
          code: "LOGGED_OUT",
          field: "token",
          message: "user logged out. Please log in again.",
          details:
            "Your token has been terminated. Please log in to get a new session.",
        },
      ],
    });
  }
  if (admin.passwordChangeAt) {
    const changedTimestamp = parseInt(
      admin.passwordChangeAt.getTime() / 1000,
      10,
    );
    if (payload.iat < changedTimestamp) {
      return next({
        statusCode: 401,
        message: "Authentication failed",
        errors: [
          {
            code: "PASSWORD_CHANGE",
            message: "Password changed recently. Please log in again.",
            field: "token",
            details:
              "Your token has been invalidated because the password was updated.",
          },
        ],
      });
    }
  }

  req.user = payload;
  next();
});
