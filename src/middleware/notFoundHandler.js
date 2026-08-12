export const notFoundHandler = (req, res, next) => {
  return next({
        statusCode: 404,
        message: "page not found",
        errors: [
          {
            code: "NOT_FOUND",
            message: "page not found",
            field: null,
            details: "invalid route"
          }
        ]
   });
 }