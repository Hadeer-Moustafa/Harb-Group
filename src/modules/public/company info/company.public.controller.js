import { catchError } from "../../../utils/catchError.js";
import { CompanyInfo } from "../../../../DB/models/admin/companyInfo.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const companyInfo = catchError(async (req, res, next) => {
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const company = await CompanyInfo.find().lean();

  if (company.length === 0) {
    return next({
      statusCode: 404,
      message: "No Information found for company",
      errors: [
        {
          code: "NOT_FOUND",
          message: "No Information found",
          details: "Company information may be deleted",
        },
      ],
    });
  }
  const companyData = company.map((info) => ({
    _id: info._id,
    name:
      lang === "ar" ? info.nameAr || info.nameEn : info.nameEn || info.nameAr,
    description:
      lang === "ar"
        ? info.descriptionAr || info.descriptionEn
        : info.descriptionEn || info.descriptionAr,
    adress: info.address,
    email: info.email,
    phoneNumbers: info.phoneNumbers,
    googleMapsUrl: info.googleMapsUrl,
    socialMediaLinks: info.socialMediaLinks,
    logo: info.logo?.url || null
  }));
  return sendSuccess(
    res,
    200,
    "Company information retrieved successfully",
    companyData,
  );
});
