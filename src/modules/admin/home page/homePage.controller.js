import { catchError } from "../../../utils/catchError.js";
import { HomepageSettings } from "../../../../DB/models/admin/homePage.model.js";
import { Products } from "../../../../DB/models/admin/product.model.js";
import { featuredProducts } from "../../../../DB/models/admin/featuredProducts.model.js";
import { Projects } from "../../../../DB/models/admin/project.model.js";
import { featuredProjects } from "../../../../DB/models/admin/featuredProjects.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

export const getHomePageContent = catchError(async (req, res, next) => {
  const content = await HomepageSettings.findOne().lean();
  return sendSuccess(
    res,
    200,
    "HomePage content retrieved successfully",
    content,
  );
});

export const updateHeroSection = catchError(async (req, res, next) => {
  const updatedData = { ...req.body };
  const updatedHomePageHero = await HomepageSettings.findOneAndUpdate(
    {},
    { $set: updatedData },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();
  if (!updatedHomePageHero) {
    return next({
      statusCode: 404,
      message: "HomePage Hero not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "HomePage Hero record does not exist in the database",
        },
      ],
    });
  }
  return sendSuccess(
    res,
    200,
    "Hero Content updated successfully",
    updatedHomePageHero,
  );
});

export const uploadHeroImage = catchError(async (req, res, next) => {
  let settings = await HomepageSettings.findOne();
  if (!settings) {
    return next({
      statusCode: 404,
      message: "Homepage settings not found",
      errors: [
        {
          code: "NOT_FOUND",
          message:
            "Homepage settings record does not exist. Please run database seeds.",
        },
      ],
    });
  }
  const uploadedImage = req.uploadedfiles[0];
  const publicId = uploadedImage.public_id;

  const responsiveVariants = {
    mobile: cloudinary.url(publicId, {
      width: 1280,
      crop: "scale",
      fetch_format: "auto",
      quality: "auto",
      secure: true,
    }),
    tablet: cloudinary.url(publicId, {
      width: 1920,
      crop: "scale",
      fetch_format: "auto",
      quality: "auto",
      secure: true,
    }),
    desktop: cloudinary.url(publicId, {
      width: 2560,
      crop: "scale",
      fetch_format: "auto",
      quality: "auto",
      secure: true,
    }),
  };

  if (settings.heroImage?.public_id) {
    try {
      await cloudinary.uploader.destroy(settings.heroImage.public_id, {
        resource_type: "image",
        invalidate: true,
      });
    } catch (err) {
      console.error("Cloudinary delete error:", err.message);
    }
  }

  settings.heroImage = {
    url: uploadedImage.url,
    public_id: uploadedImage.public_id,
    responsiveVariants,
  };

  await settings.save();

  return sendSuccess(
    res,
    200,
    "Hero image uploaded with responsive variants successfully",
    settings.heroImage,
  );
});

export const setFeaturedProducts = catchError(async (req, res, next) => {
  const { productIds } = req.body;
  const extractedIds = productIds.map((item) => item.productId);

  const existingProducts = await Products.find({
    _id: { $in: extractedIds },
    isAvailable: true,
  }).select("_id");

  if (existingProducts.length !== extractedIds.length) {
    const existingIdSet = new Set(
      existingProducts.map((p) => p._id.toString()),
    );
    const missingIds = extractedIds.filter(
      (id) => !existingIdSet.has(id.toString()),
    );

    return next({
      statusCode: 404,
      message: "Validation failed",
      errors: [
        {
          code: "NOT_FOUND",
          message: `The following product IDs do not exist or are not available: ${missingIds.join(", ")}`,
        },
      ],
    });
  }

  const documentsToInsert = productIds.map((item, index) => ({
    productId: item.productId,
    displayOrder: item.displayOrder ?? index + 1,
  }));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await featuredProducts.deleteMany({}, { session });
    await featuredProducts.insertMany(documentsToInsert, { session });

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return next(error);
  } finally {
    session.endSession();
  }

  const result = await featuredProducts
    .find()
    .sort({ displayOrder: 1 })
    .populate({
      path: "productId",
      select: "nameAr nameEn images",
    });

  const formattedFeaturedProducts = result.map((item) => ({
    productId: item.productId?._id,
    productName: item.productId?.nameEn || "",
    displayOrder: item.displayOrder,
    imageUrl: item.productId?.images?.[0]?.url || "",
  }));

  return sendSuccess(res, 200, "Featured products updated successfully", {
    featuredProducts: formattedFeaturedProducts,
    totalFeatured: formattedFeaturedProducts.length,
  });
});

export const setFeaturedProjects = catchError(async (req, res, next) => {
  const { projectIds } = req.body;
  const extractedIds = projectIds.map((item) => item.projectId);

  const existingProjects = await Projects.find({
    _id: { $in: extractedIds },
    isActive: true,
  }).select("_id");

  if (existingProjects.length !== extractedIds.length) {
    const existingIdSet = new Set(
      existingProjects.map((p) => p._id.toString()),
    );
    const missingIds = extractedIds.filter(
      (id) => !existingIdSet.has(id.toString()),
    );

    return next({
      statusCode: 404,
      message: "Validation failed",
      errors: [
        {
          code: "NOT_FOUND",
          message: `The following project IDs do not exist or are not active: ${missingIds.join(", ")}`,
        },
      ],
    });
  }

  const documentsToInsert = projectIds.map((item, index) => ({
    projectId: item.projectId,
    displayOrder: item.displayOrder ?? index + 1,
  }));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await featuredProjects.deleteMany({}, { session });
    await featuredProjects.insertMany(documentsToInsert, { session });

    await session.commitTransaction();
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return next(error);
  } finally {
    session.endSession();
  }

  const result = await featuredProjects
    .find()
    .sort({ displayOrder: 1 })
    .populate({
      path: "projectId",
      select: "nameEn images",
    });

  const formattedFeaturedProjects = result.map((item) => ({
    projectId: item.projectId?._id,
    projectName: item.projectId?.nameEn || "",
    displayOrder: item.displayOrder,
    imageUrl: item.productId?.images?.[0]?.url || "",
  }));

  return sendSuccess(res, 200, "Featured projects updated successfully", {
    featuredProjects: formattedFeaturedProjects,
    totalFeatured: formattedFeaturedProjects.length,
  });
});
