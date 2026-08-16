import { catchError } from "../../../utils/catchError.js";
import { CompanyInfo } from "../../../../DB/models/admin/companyInfo.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import {v2 as cloudinary} from "cloudinary"

export const getCompanyInfo = catchError (async (req ,res , next) => {
    const companyInfo = await CompanyInfo.findOne().lean();
    return sendSuccess(res,200,"Company information retrieved successfully",companyInfo)
});

export const updateCompanyInfo = catchError (async (req , res , next) => {
    const updatedData = {...req.body};
    const updatedCompanyInfo = await CompanyInfo.findOneAndUpdate(
    {},
    { $set: updatedData },
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).lean();
  if (!updatedCompanyInfo) {
    return next({
      statusCode: 404,
      message: "Company info not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Company info record does not exist in the database",
        },
      ],
    });
  }
  return sendSuccess(res,200,"Company information updated successfully",updatedCompanyInfo);
});

export const uploadCompanyLogo = catchError (async (req , res , next) => {
    const companyInfo = await CompanyInfo.findOne();
    if(!companyInfo) {
        return next({
      statusCode: 404,
      message: "Company info not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Company info record does not exist in the database",
        },
      ],
    });
    }
     if (req.uploadedfiles && req.uploadedfiles.length > 0) {
        if (companyInfo.logo?.public_id) {
          await cloudinary.uploader.destroy(companyInfo.logo.public_id, {
            resource_type: "image",
            invalidate: true,
          });
        }
    }
     companyInfo.logo = {
          url: req.uploadedfiles[0].url,
          public_id: req.uploadedfiles[0].public_id,
        };
      await companyInfo.save();
      return sendSuccess(
        res,
        201,
        "Logo uploaded successfully",
        companyInfo.logo,
      );
});

export const deleteCompanyLogo = catchError (async (req ,res , next) => {
    const companyInfo = await CompanyInfo.findOne();
    if(!companyInfo) {
           return next({
      statusCode: 404,
      message: "Company info not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Company info record does not exist in the database",
        },
      ],
    });
    }

    if(!companyInfo.logo?.public_id) {
           return next({
      statusCode: 404,
      message: "Logo not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "No logo currently set",
        },
      ],
    });
    }
    const logoPublicId = companyInfo.logo.public_id;
    (async () => {
      try {
        await cloudinary.uploader.destroy(logoPublicId, {
          resource_type: "image",
          invalidate: true,
        });
      } catch (err) {
        console.error("Cloudinary Image Delete Error:", err.message);
      }
    })();
  
      companyInfo.logo = undefined;
      await companyInfo.save();
      return res.status(204).send();
})