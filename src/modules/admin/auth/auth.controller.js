import bcrypt from "bcryptjs";
import { AdminUser } from "../../../../DB/models/admin/admin.model.js";
import jwt from "jsonwebtoken";
import { AuthenticationLog } from "../../../../DB/models/admin/admin.model.js";
import { catchError } from "../../../utils/catchError.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import { generateAccessToken } from "../../../middleware/token.js";
import { generateRefreshToken } from "../../../middleware/token.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const loginFailureLimiter = new RateLimiterMemory({
  points: 5,            
  duration: 15 * 60,     
  blockDuration: 15 * 60 
});

export const login = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  const limiterKey = `${req.ip}_${email}`;
// Check if the user is currently blocked from previous failed attempts
  const limiterRes = await loginFailureLimiter.get(limiterKey);

  if (limiterRes !== null && limiterRes.consumedPoints >= 5) {
    const retrySecs = Math.round(limiterRes.msBeforeNext / 1000) || 1;
    res.set("Retry-After", String(retrySecs));

    return next({
      statusCode: 429,
      message: "Too many failed attempts",
      errors: [
        {
          code: "ACCOUNT_LOCKED_TEMPORARILY",
          message: `Too many failed login attempts. Please try again after ${Math.ceil(retrySecs / 60)} minutes.`,
          field: "email or password",
        },
      ],
    });
  }

  const admin = await AdminUser.findOne({
    email: email,
  }).select("+passwordHash");

  const handleAuthFailure = async () => {
    try {
      // Consume one failure point
      await loginFailureLimiter.consume(limiterKey);
    } catch (rlRejected) {
      // 5th failed attempt reached; trigger temporary block
      const retrySecs = Math.round(rlRejected.msBeforeNext / 1000) || 1;
      res.set("Retry-After", String(retrySecs));

      return next({
        statusCode: 429,
        message: "Too many failed attempts",
        errors: [
          {
            code: "ACCOUNT_LOCKED_TEMPORARILY",
            message: `Too many failed login attempts. Account locked for ${Math.ceil(retrySecs / 60)} minutes.`,
            field: "email or password",
          },
        ],
      });
    }

    // Remaining attempts available, but credentials are invalid
    return next({
      statusCode: 401,
      message: "Invalid credentials",
      errors: [
        {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
          field: "email or password",
          details: "The provided email or password is incorrect",
        },
      ],
    });
  };

  if (!admin) {
   return handleAuthFailure();
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
   return handleAuthFailure();
  }

  if(!admin.isActive){
    return next({
      statusCode: 403,
      message: "Account is inactive",
      errors: [
        {
          code: "ACCOUNT_INACTIVE",
          message: "This account has been disabled",
          details: "Contact system administrator for assistance",
        },
      ],
    });
  }

  //Reset rate limiter counter on successful login
  await loginFailureLimiter.delete(limiterKey);

  const accesstoken = generateAccessToken({
    id: admin._id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
  //  await AuthenticationLog.create({
  //     adminId: admin._id,
  //     action: "login",
  //     ipAddress: req.ip,
  //     userAgent: req.headers['user-agent'],
  //     expiresIn: "15m"
  // });
  
  const refreshToken = generateRefreshToken({
    id: admin._id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
  await AdminUser.updateOne({ _id: admin._id }, { refreshToken: refreshToken });
  // Set the refresh token in an HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
  return sendSuccess(res, 200, "Login successful", {
    accessToken: accesstoken,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    },
  });
});

export const refreshToken = catchError(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next({
      statusCode: 401,
      message: "Refresh token is required",
      errors: [
        {
          code: "REFRESH_TOKEN_REQUIRED",
          message: "Refresh token is required",
          field: "refreshToken",
          details:
            "Refresh token must be provided in the request cookies you may be logged out ",
        },
      ],
    });
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    res.clearCookie("refreshToken", cookieOptions);
    return next({
      statusCode: 401,
      message: "Invalid refresh token or has expired",
      errors: [
        {
          code: "INVALID_REFRESH_TOKEN",
          message: "Invalid refresh token or has expired",
          field: "refreshToken",
          details: "The provided refresh token is invalid or has expired",
        },
      ],
    });
  }

  const admin = await AdminUser.findOne({
    _id: payload.id,
    refreshToken: refreshToken,
    isActive: true,
  })
    .select("_id email name role")
    .lean();
  if (!admin) {
    res.clearCookie("refreshToken", cookieOptions);
    return next({
      statusCode: 401,
      message: "Admin not found or inactive",
      errors: [
        {
          code: "ADMIN_NOT_FOUND",
          message: "Admin user not found",
          field: "id",
          details:
            "No active admin user found with the provided ID and refresh token",
        },
      ],
    });
  }
  const newAccessToken = generateAccessToken({
    id: admin._id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
  return sendSuccess(res, 200, "Access token refreshed successfully", {
    accessToken: newAccessToken,
  });
});

export const logout = catchError(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.clearCookie("refreshToken", cookieOptions);
    return sendSuccess(res, 200, "already logged out");
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    res.clearCookie("refreshToken", cookieOptions);
    return sendSuccess(res, 200, "already logged out");
  }
  await AdminUser.updateOne(
    { _id: payload.id, refreshToken: refreshToken, isActive: true },
    { $unset: { refreshToken: "" } },
  );
  res.clearCookie("refreshToken", cookieOptions);
  return sendSuccess(res, 200, "Logged out successfully");
});

export const getAdminProfile = catchError(async (req, res, next) => {
  const adminId = req.user.id;
  const admin = await AdminUser.findById(adminId).select(
    "-passwordHash -refreshToken",
  );
  return sendSuccess(res, 200, "Admin profile retrieved successfully", {
    admin,
  });
});

export const updateAdminProfile = catchError(async (req, res, next) => {
  const adminId = req.user.id;
  const { name, email, phone } = req.body || {};

  const updateData = {};
  if (name !== undefined) updateData.name = req.body.name;
  if (email !== undefined) updateData.email = req.body.email;
  if (phone !== undefined) updateData.phone = req.body.phone;

  if (Object.keys(updateData).length === 0) {
    const admin = await AdminUser.findById(adminId).select(
      "-_id name email phone role",
    );
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
    return sendSuccess(res, 200, "no new data added to update profile", {
      admin,
    });
  }
  const updatedProfile = await AdminUser.findByIdAndUpdate(
    adminId,
    updateData,
    { returnDocument: "after" },
  ).select("-_id name email phone role");
  return sendSuccess(res, 200, "Profile updated successfully", {
    updatedProfile,
  });
});

export const changePassword = catchError(async (req, res, next) => {
  const adminId = req.user.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const admin = await AdminUser.findOne({ _id: adminId }).select(
    "passwordHash email",
  );
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
  if (admin.email) {
    const emailPrefix = admin.email.split("@")[0];
    if (newPassword.toLowerCase().includes(emailPrefix)) {
      return next({
        statusCode: 400,
        message: "Validation failed",
        errors: [
          {
            code: "INVALID_NEW_PASSWORD",
            message: "invalid new password",
            field: "newPassword",
            details: "New password cannot contain your email address",
          },
        ],
      });
    }
  }
  const verify = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!verify) {
    return next({
      statusCode: 422,
      message: "Validation failed",
      errors: [
        {
          code: "VALIDATION_ERROR",
          message: "Current password is incorrect",
          field: "currentPassword",
          details: "please enter your current password valid",
        },
      ],
    });
  }

  if (newPassword === currentPassword) {
    return next({
      statusCode: 409,
      message: "Password change failed",
      errors: [
        {
          code: "PASSWORD_REUSE",
          message: "Your current password and new password are the same",
          field: "currentPassword",
          details:
            "your new password cannot be the same as your current password",
        },
      ],
    });
  }
  const newPasswordHash = await bcrypt.hash(
    newPassword,
    parseInt(process.env.SALTROUNDS),
  );

  await AdminUser.findByIdAndUpdate(adminId, {
    passwordHash: newPasswordHash,
    passwordChangeAt: Date.now() - 1000,
    refreshToken: "",
  });
  res.clearCookie("refreshToken", cookieOptions);
  return sendSuccess(res, 200, "password changed successfully", {
    message: "Your password has been updated. You will need to log in again.",
  });
});
