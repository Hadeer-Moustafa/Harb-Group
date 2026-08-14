import { catchError } from "../../../utils/catchError.js";
import { Services } from "../../../../DB/models/admin/service.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import {v2 as cloudinary} from "cloudinary"
export const createService = catchError(async (req, res, next) => {
  const { nameAr, nameEn, descriptionAr, descriptionEn } = req.body;
  let displayOrder = req.body.displayOrder;
  const oldservice = await Services.findOne({
    $or: [{ nameAr }, { nameEn }],
    isActive: true,
  });
  const isDuplicateAr = oldservice?.nameAr === nameAr;
  const duplicateField = isDuplicateAr ? "nameAr" : "nameEn";
  if (oldservice) {
    return next({
      statusCode: 422,
      message: "service with this name already exists",
      errors: [
        {
          code: "DUPLICATE_NAME",
          message: "service with this name already exists",
          field: duplicateField,
          details: isDuplicateAr
            ? "A service with this Arabic name already exists"
            : "A service with this English name already exists",
        },
      ],
    });
  }
  if (displayOrder && Number(displayOrder) > 0) {
    displayOrder = Number(displayOrder);
    await Services.updateMany(
      { displayOrder: { $gte: displayOrder } },
      { $inc: { displayOrder: 1 } },
    );
  } else {
    const lastService = await Services.findOne().sort({
      displayOrder: -1,
    });
    displayOrder =
      lastService && lastService.displayOrder
        ? lastService.displayOrder + 1
        : 1;
  }
  const service = await Services.create({
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    displayOrder,
  });
  return sendSuccess(res, 201, "Service created successfully", service);
});

export const updateService = catchError(async (req, res, next) => {
  const { serviceId } = req.params;
  const { nameAr, nameEn, descriptionAr, descriptionEn, isActive } = req.body;
  let displayOrder = req.body.displayOrder;
  const service = await Services.findById(serviceId);
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
  if (nameAr || nameEn) {
    const oldservice = await Services.findOne({
      $or: [{ nameAr }, { nameEn }],
      _id: { $ne: serviceId },
      isActive: true,
    });
    const isDuplicateAr = oldservice?.nameAr === nameAr;
    const duplicateField = isDuplicateAr ? "nameAr" : "nameEn";
    if (oldservice) {
      return next({
        statusCode: 422,
        message: "service with this name already exists",
        errors: [
          {
            code: "DUPLICATE_NAME",
            message: "service with this name already exists",
            field: duplicateField,
            details: isDuplicateAr
              ? "A service with this Arabic name already exists"
              : "A service with this English name already exists",
          },
        ],
      });
    }
  }
  if (displayOrder && Number(displayOrder) > 0) {
    displayOrder = Number(displayOrder);
    if (displayOrder !== service.displayOrder) {
      await Services.updateMany(
        { displayOrder: { $gte: displayOrder } },
        { $inc: { displayOrder: 1 } },
      );
    }
  }
  const updatedService = await Services.findByIdAndUpdate(
    serviceId,
    {
      nameAr: nameAr ?? service.nameAr,
      nameEn: nameEn ?? service.nameEn,
      descriptionAr: descriptionAr ?? service.descriptionAr,
      descriptionEn: descriptionEn ?? service.descriptionEn,
      displayOrder: displayOrder ?? service.displayOrder,
      isActive: isActive ?? service.isActive,
    },
    { returnDocument: "after", runValidators: true },
  );

  return sendSuccess(res, 200, "service updated successfully", updatedService);
});

export const deleteService = catchError(async (req, res, next) => {
  const { serviceId } = req.params;
  const service = await Services.findById(serviceId);
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

     const folderPath = `services/${serviceId}`;
  
   try {
    const subFolders = await cloudinary.api.sub_folders("services");
    const isFolderExist = subFolders.folders.some(
      (folder) => folder.name === serviceId
    );

    if (isFolderExist) {
      await cloudinary.api.delete_resources_by_prefix(folderPath);
      await cloudinary.api.delete_folder(folderPath);

      console.log(`Folder ${folderPath} deleted successfully from Cloudinary`);
    } else {
      console.log(`Folder ${folderPath} does not exist on Cloudinary, skipping delete.`);
    }
  } catch (error) {
    if (error.error?.http_code === 404 || error.http_code === 404) {
      console.log("Parent or target folder not found on Cloudinary");
    } else {
      console.error("Cloudinary Folder Delete Error:", error);
    }
  }
  
  await Services.findByIdAndDelete(serviceId);
   return res.status(204).send();
});

export const upload_updateServiceImage = catchError(async (req, res, next) => {
  const { serviceId } = req.params;
  const service = await Services.findById(serviceId);
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
  if (req.uploadedfiles && req.uploadedfiles.length > 0) {
    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(service.image.public_id, {
        resource_type: "image",
        invalidate: true,
      });
    }
    service.image = {
      url: req.uploadedfiles[0].url,
      public_id: req.uploadedfiles[0].public_id,
    };
  }
  await service.save();
  return sendSuccess(
    res,
    201,
    "Service image uploaded successfully",
    service.image,
  );
});

export const deleteServiceImage = catchError (async (req , res, next) => {
    const { serviceId } = req.params;
  const service = await Services.findById(serviceId);
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
  if(!service.image?.public_id) {
      return next({
      statusCode: 404,
      message: "image not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "image not found",
          details: "Service with this ID does not have image",
        },
      ],
    });
  }
  await cloudinary.uploader.destroy(service.image.public_id, {
        resource_type: "image",
        invalidate: true,
      });
      service.image = undefined;
      await service.save();
      return res.status(204).send();
})
