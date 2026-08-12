export const validate = (schema) => {
  return (req, res, next) => {
    const copyreqData = { ...req.body, ...req.params, ...req.query };//data merging
    const result = schema.validate(copyreqData, {
      abortEarly: false,
      errors: {
        wrap: {
          label: false,
        },
      },
    });
    if (result.error) {
      const errors = result.error.details.map((detail) => ({
        code: "VALIDATION_ERROR",
        message: detail.message,
        field: detail.path.join(".") || null,
        details: detail.message,
      }));
      return next({
        statusCode: 422,
        message: "Validation Error",
        errors: errors,
      });
    }
  if (req.body && typeof result.value === "object") {
  Object.assign(req.body, result.value);// Update req.body with the validated and transformed data

  if (req.params) {
    Object.keys(req.params).forEach((key) => delete req.body[key]);// Remove URL params that leaked into req.body during data merging
  }
  if (req.query) {
    Object.keys(req.query).forEach((key) => delete req.body[key]);//Remove URL query parameters that leaked into req.body during data merging
  }
}
    return next();
  };
};
