import { catchError } from "../../../utils/catchError.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import { HomepageSettings } from "../../../../DB/models/admin/homePage.model.js";
import { featuredProducts } from "../../../../DB/models/admin/featuredProducts.model.js";
import { featuredProjects } from "../../../../DB/models/admin/featuredProjects.model.js";
import { Products } from "../../../../DB/models/admin/product.model.js";
import { Projects } from "../../../../DB/models/admin/project.model.js";

export const getHomePage = catchError(async (req, res, next) => {
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const [heroData, featuredProductsList, featuredProjectsList] =
    await Promise.all([
      HomepageSettings.findOne().lean(),
      featuredProducts
        .find()
        .populate({
          path: "productId",
          select: "_id nameAr nameEn descriptionAr descriptionEn images",
        })
        .sort({ displayOrder: 1 })
        .lean(),
      featuredProjects
        .find()
        .populate({
          path: "projectId",
          select: "_id nameAr nameEn completionYear clientName images",
        })
        .sort({ displayOrder: 1 })
        .lean(),
    ]);

  if (!heroData) {
    return next({
      statusCode: 404,
      message: "No Hero data found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "No Hero data found",
          details: "Hero data may be deleted",
        },
      ],
    });
  }

  const hero = {
    title: lang === "ar" ? heroData.heroTitleAr : heroData.heroTitleEn,
    subtitle:
      lang === "ar"
        ? heroData.heroSubtitleAr || heroData.heroSubtitleEn
        : heroData.heroSubtitleEn || heroData.heroSubtitleAr,
    imageUrl: heroData.heroImage?.url,
    imageResponsiveVariants: heroData.heroImage?.responsiveVariants,
  };

  const productsData = featuredProductsList
    .filter((item) => item.productId)
    .map((item) => {
      const p = item.productId;
      return {
        _id: p._id,
        name: lang === "ar" ? p.nameAr : p.nameEn,
        description:
          lang === "ar"
            ? p.descriptionAr || p.descriptionEn
            : p.descriptionEn || p.descriptionAr,
        image: p.images?.[0]?.url || p.images?.[0] || null,
        displayOrder: item.displayOrder,
      };
    });

  const projectsData = featuredProjectsList
    .filter((item) => item.projectId)
    .map((item) => {
      const proj = item.projectId;
      return {
        _id: proj._id,
        name: lang === "ar" ? proj.nameAr : proj.nameEn,
        clientName: proj.clientName,
        completionYear: proj.completionYear,
        image: proj.images?.[0]?.url || proj.images?.[0] || null,
        displayOrder: item.displayOrder,
      };
    });

  return sendSuccess(res, 200, "Homepage settings retrieved successfully", {
    hero,
    featuredProducts: productsData,
    featuredProjects: projectsData,
  });
});
