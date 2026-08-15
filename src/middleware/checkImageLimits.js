import { catchError } from "../utils/catchError.js";
import { Products } from "../../DB/models/admin/product.model.js";

export const checkDocAndImageLimit = ({
  model,
  resourceName = 'document',
  paramName = null,
  maxImages = 20,
  imageField = 'images',
}) => {
return catchError(async (req, res, next) => {
  // 1. Extract product ID from path parameters
  const DocId = req.params[paramName] || req.params.id;

  // 2. Fetch the product from the database
  const document = await model.findById(DocId);

  // Return 404 if the product does not exist
  if (!document) {
    return next({
      statusCode: 404,
      message: `${resourceName} not found`,
      errors: [
        {
          code: "NOT_FOUND",
          message: `${resourceName} not found` ,
          details: `No ${resourceName} found with ID: ${DocId}`,
        },
      ],
    });
  }
  if (req.files && req.files?.[0]?.mimetype?.startsWith("image/")) {
    // 3. Get the count of incoming images from Multer (upload.array)
    const incomingFilesCount = req.files ? req.files.length : 0;

    // 4. Get current images count stored in the database
    const currentImagesCount = document[imageField] ? document[imageField].length : 0;

    // 5. Calculate total combined image count
    const totalAfterUpload = currentImagesCount + incomingFilesCount;

    // 6. Validate total image count against the max limit (20 images)
    if (totalAfterUpload > maxImages) {
      const remainingAllowed = maxImages - currentImagesCount;

      return next({
        statusCode: 400,
        message: "Operation failed",
        errors: [
          {
            code: "LIMIT_EXCEEDED",
            message: `${resourceName} images limit exceeded`,
            field: "images",
            details: `${resourceName} currently has ${currentImagesCount} images. You can only add up to ${remainingAllowed} more image(s) to reach the maximum limit of ${maxImages}.`,
          },
        ],
      });
    }
  }
  // 7. Attach fetched product to request object for controller reuse
  req[resourceName] = document;
  // Proceed to the next middleware (processAndUpload)
  return next();
});
}

