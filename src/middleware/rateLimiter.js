import rateLimit from "express-rate-limit";

const createRateLimiter = ({ windowMinutes, maxAttempts, message, code }) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxAttempts,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      return next({
        statusCode: 429,
        message: "Too many requests",
        errors: [
          {
            code: code || "TOO_MANY_REQUESTS",
            message:
              message ||
              `Too many requests. Please try again after ${windowMinutes} minutes.`,
            field: "rate_limit",
          },
        ],
      });
    },
  });
};

export const contactUsLimiter = createRateLimiter({
  windowMinutes: 60,
  maxAttempts: 5,
  message:
    "Too many messages sent from this IP. Please try again after an hour.",
  code: "CONTACT_RATE_LIMIT_EXCEEDED",
});

export const changePasswordLimiter = createRateLimiter({
  windowMinutes: 60,
  maxAttempts: 5,
  message: "Too many password change attempts. Please try again after an hour.",
  code: "PASSWORD_CHANGE_LIMIT_EXCEEDED",
});

export const profileLimiter = createRateLimiter({
  windowMinutes: 1,
  maxAttempts: 60,
  message: "Too many profile requests. Please slow down.",
  code: "PROFILE_RATE_LIMIT_EXCEEDED",
});
