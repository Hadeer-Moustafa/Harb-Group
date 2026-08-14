import multer from "multer";

const memoryStorage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const customError = {
      statusCode: 400,
      message: "Operation failed",
      errors: [
        {
          code: "VALIDATION_ERROR",
          message: "Invalid image type",
          field: file.fieldname,
          details:
            "image format is invalid. Only JPEG, PNG, and WEBP are allowed.",
        },
      ],
    };
    cb(customError, false);
  }
};

export const uploadImages = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeType = "application/pdf";

  if (file.mimetype === allowedMimeType) {
    cb(null, true);
  } else {
    const customError = {
      statusCode: 400,
      message: "Operation failed",
      errors: [
        {
          code: "VALIDATION_ERROR",
          message: "Invalid file type",
          field: file.fieldname,
          details: "File format is invalid. Only pdf are allowed.",
        },
      ],
    };
    cb(customError, false);
  }
};

export const uploadFile = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
// handel multer errors for images (array)
export const uploadImagesArray = (
  fieldName = "images",
  maxCount = 10,
  isSingle = false,
) => {
  return (req, res, next) => {
    const upload = isSingle
      ? uploadImages.single(fieldName)
      : uploadImages.array(fieldName, maxCount);

    upload(req, res, (err) => {
      if (err) {
        // array of image exceed 10 file in one time
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return next({
            statusCode: 400,
            message: "Operation failed",
            errors: [
              {
                code: "TOO_MANY_FILES",
                message: isSingle
                  ? `Only 1 file is allowed for field '${fieldName}'`
                  : `You cannot upload more than ${maxCount} files at once`,
                field: fieldName,
                etails: isSingle
                  ? `The field '${fieldName}' accepts only a single image file.`
                  : `The field '${fieldName}' exceeded the maximum allowed limit of ${maxCount} files.`,
              },
            ],
          });
        }
        // if image file size exceed 10M
        if (err.code === "LIMIT_FILE_SIZE") {
          return next({
            statusCode: 400,
            message: "Operation failed",
            errors: [
              {
                code: "FILE_TOO_LARGE",
                message: "Single file size exceeds 10 MB limit",
                field: fieldName,
                details: "Please ensure each image is smaller than 10 MB.",
              },
            ],
          });
        }

        return next(err);
      }

      return next();
    });
  };
};
// handel multer errors for file (pdf)
export const uploadSingleFile = (fieldName = "file") => {
  return (req, res, next) => {
    const upload = uploadFile.single(fieldName);

    upload(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next({
            statusCode: 400,
            message: "Operation failed",
            errors: [
              {
                code: "FILE_TOO_LARGE",
                message: "File size exceeds 10 MB limit",
                field: fieldName,
                details:
                  "Please ensure the PDF file size is smaller than 10 MB.",
              },
            ],
          });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return next({
            statusCode: 400,
            message: "Operation failed",
            errors: [
              {
                code: "TOO_MANY_FILES",
                message: "Only a single file is allowed for this endpoint",
                field: fieldName,
                details: `You sent multiple files or sent a file with an unexpected key name. Please send exactly 1 file using the field key '${fieldName}'.`,
              },
            ],
          });
        }
        return next(err);
      }

      return next();
    });
  };
};
