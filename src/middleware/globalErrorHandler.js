import crypto from "crypto";
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const traceId = req.traceId || crypto.randomUUID();

  // Log the error details for debugging purposes
  console.error(`[ERROR] [traceId: ${traceId}] - Status: ${statusCode} - Message: ${err.message}`);
  if (err.stack) {
    console.error(`[STACK TRACE] [traceId: ${traceId}]`, err.stack);
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    data:null,
    errors: err.errors || [
      {
        code: "ERROR",
        message: err.message,
        field: null,
        details: err.message
      }
    ],
    timestamp: new Date().toISOString(),
    traceId: traceId
  }
  )}
