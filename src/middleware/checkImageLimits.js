import { catchError } from "../utils/catchError.js";
import { Products } from "../../DB/models/admin/product.model.js";

export const checkProductAndImageLimit = catchError(async (req, res, next) => {
  // 1. Extract product ID from path parameters
  const productId = req.params.productId || req.params.id;

  // 2. Fetch the product from the database
  const product = await Products.findById(productId);

  // Return 404 if the product does not exist
  if (!product) {
    return next({
      statusCode: 404,
      message: "Product not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Product not found",
          details: `No product found with ID: ${productId}`,
        },
      ],
    });
  }
  if (req.files && req.files?.[0]?.mimetype?.startsWith("image/")) {
    // 3. Get the count of incoming images from Multer (upload.array)
    const incomingFilesCount = req.files ? req.files.length : 0;

    // 4. Get current images count stored in the database
    const currentImagesCount = product.images ? product.images.length : 0;

    // 5. Calculate total combined image count
    const totalAfterUpload = currentImagesCount + incomingFilesCount;

    // 6. Validate total image count against the max limit (20 images)
    if (totalAfterUpload > 20) {
      const remainingAllowed = 20 - currentImagesCount;

      return next({
        statusCode: 400,
        message: "Operation failed",
        errors: [
          {
            code: "LIMIT_EXCEEDED",
            message: "Product images limit exceeded",
            field: "images",
            details: `Product currently has ${currentImagesCount} images. You can only add up to ${remainingAllowed} more image(s) to reach the maximum limit of 20.`,
          },
        ],
      });
    }
  }
  // 7. Attach fetched product to request object for controller reuse
  req.product = product;
  // Proceed to the next middleware (processAndUpload)
  return next();
});
