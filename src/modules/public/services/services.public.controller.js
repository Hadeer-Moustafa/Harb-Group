import { catchError } from "../../../utils/catchError.js";
import { Services } from "../../../../DB/models/admin/service.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const getAllServices = catchError(async (req, res, next) => {
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const services = await Services.find({ isActive: true })
    .select("_id nameAr nameEn image.url displayOrder ")
    .sort({ displayOrder: 1 })
    .lean();

  const servicesData = services.map((service) => ({
    _id: service._id,
    name:
      lang === "ar"
        ? service.nameAr || service.nameEn
        : service.nameEn || service.nameAr,
    image: service.image,
    displayOrder: service.displayOrder,
  }));

  return sendSuccess(res, 200, "Services retrieved successfully", {
    services: servicesData,
  });
});

export const getserviceById = catchError(async (req, res, next) => {
  const { serviceId } = req.params;
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const service = await Services.findOne({ _id: serviceId, isActive: true })
    .select(
      "_id nameAr nameEn image.url descriptionAr descriptionEn ",
    )
    .lean();
  if (!service) {
    return next({
      statusCode: 404,
      message: "Service not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Service does not exist",
          field: "serviceId",
          details: "Service with this ID does not exist",
        },
      ],
    });
  }
  const formattedService = {
    _id: service._id,
    name:
      lang === "ar"
        ? service.nameAr || service.nameEn
        : service.nameEn || service.nameAr,
    description:
      lang === "ar"
        ? service.descriptionAr || service.descriptionEn
        : service.descriptionEn || service.descriptionAr,
    image: service.image,
  };

  return sendSuccess(res, 200, "Service retrieved successfully", {
    service: formattedService,
  });
});
