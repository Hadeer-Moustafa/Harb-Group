import { catchError } from "../../../utils/catchError.js";
import { Products } from "../../../../DB/models/admin/product.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const getAllProducts = catchError(async (req, res, next) => {
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const products = await Products.find({ isAvailable: true })
    .select(
      "_id nameAr nameEn descriptionAr descriptionEn images displayOrder ",
    )
    .sort({ displayOrder: 1 })
    .lean();

  const productsData = products.map((product) => ({
    _id: product._id,
    name:
      lang === "ar"
        ? product.nameAr || product.nameEn
        : product.nameEn || product.nameAr,
    description:
      lang === "ar"
        ? product.descriptionAr || product.descriptionEn
        : product.descriptionEn || product.descriptionAr,
    image: product.images[0]?.url,
    displayOrder: product.displayOrder,
  }));

  return sendSuccess(res, 200, "Products retrieved successfully", {
    products: productsData,
  });
});

export const getProductById = catchError(async (req, res, next) => {
  const { productId } = req.params;
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const product = await Products.findOne({ _id: productId, isAvailable: true })
    .select("_id nameAr nameEn images descriptionAr descriptionEn productPdf")
    .lean();
  if (!product) {
    return next({
      statusCode: 404,
      message: "product not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "product does not exist",
          field: "productId",
          details: "Product with this ID does not exist",
        },
      ],
    });
  }
  const formattedProduct = {
    _id: product._id,
    name:
      lang === "ar"
        ? product.nameAr || product.nameEn
        : product.nameEn || product.nameAr,
    description:
      lang === "ar"
        ? product.descriptionAr || product.descriptionEn
        : product.descriptionEn || product.descriptionAr,
    images: product.images?.map((img) => img.url) || [],
    productPdf: product.productPdf?.pdfURL,
  };

  return sendSuccess(res, 200, "Product retrieved successfully", {
    product: formattedProduct,
  });
});
