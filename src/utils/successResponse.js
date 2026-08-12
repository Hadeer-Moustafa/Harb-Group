export const sendSuccess = (res, statusCode = 200, message = "Operation successful", data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
    errors: [],
    timestamp: new Date().toISOString(),
  });
};