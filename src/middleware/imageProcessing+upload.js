import sharp from "sharp";
import cloudinary from "../utils/cloudinary.config.js";
import { catchError } from "../Utils/catchError.js";

// function upload images after processing to cloudinary
const uploadStreamToCloudinary = (
  buffer,
  folderName,
  resourceType = "raw",
  format = null,
) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: folderName,
      resource_type: resourceType,
    };

    if (format) {
      options.format = format;
      if (resourceType === "raw") {
        options.use_filename = true;
        options.unique_filename = true;
      }
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export const processAndUpload = (options = {}) => {
  const { folder = "general", quality = 85 } = options;

  return catchError(async (req, res, next) => {
    let filesToProcess = [];

    // 1. Gather incoming files
    if (req.files && Array.isArray(req.files)) {
      filesToProcess = req.files;
    } else if (req.files && typeof req.files === "object") {
      filesToProcess = Object.values(req.files).flat();
    } else if (req.file) {
      filesToProcess = [req.file];
    }

    // 2. Validate at least 1 file/image is present
    if (filesToProcess.length === 0 && !options.isUpdate) {
      return next({
        statusCode: 400,
        message: "Operation failed",
        errors: [
          {
            code: "VALIDATION_ERROR",
            message: "At least 1 file or image is required",
            field: "files",
            details:
              "Please provide at least one valid file or image to proceed.",
          },
        ],
      });
    }

    if (filesToProcess.length === 0) {
      req.uploadedfiles = [];
      return next();
    }

    // 3. Total size validation (Max 50 MB)
    const totalSizeInBytes = filesToProcess.reduce(
      (sum, file) => sum + file.size,
      0,
    );
    const maxTotalSizeInBytes = 50 * 1024 * 1024; // 50 MB

    if (totalSizeInBytes > maxTotalSizeInBytes) {
      return next({
        statusCode: 413,
        message: "Upload failed",
        errors: [
          {
            code: "FILE_TOO_LARGE",
            message: "Total upload size exceeds 50 MB limit",
          },
        ],
      });
    }

    //  PHASE 1: Validate ALL image dimensions BEFORE uploading ANYTHING
    const processedFiles = [];

    for (const file of filesToProcess) {
      let processedBuffer = file.buffer;
      let resourceType = "auto";
      let format = null;

      if (file.mimetype.startsWith("image/")) {
        const image = sharp(file.buffer);
        const metadata = await image.metadata();

        // Dimensions validation (200x200 to 4000x4000 px)
        if (
          metadata.width < 200 ||
          metadata.height < 200 ||
          metadata.width > 4000 ||
          metadata.height > 4000
        ) {
          return next({
            statusCode: 400,
            message: "Operation failed",
            errors: [
              {
                code: "VALIDATION_ERROR",
                message: "Invalid image dimensions",
                field: file.fieldname,
                details: `Image (${file.originalname}) dimensions (${metadata.width}x${metadata.height}) are out of range. Allowed range is 200x200 to 4000x4000 pixels.`,
              },
            ],
          });
        }

        // Compress and convert to webp buffer in memory
        processedBuffer = await image.webp({ quality }).toBuffer();
        resourceType = "image";
        format = "webp";
      } else {
        resourceType = "raw";
        format = "pdf";
      }
      processedFiles.push({
        file,
        processedBuffer,
        resourceType,
        format,
      });
    }

    //  PHASE 2: Upload to Cloudinary (Executed ONLY if all validations pass)
    const subFolder = req.params.id || req.params.productId || null;
    const targetFolder = subFolder ? `${folder}/${subFolder}` : folder;
    const successfullyUploaded = [];

    try {
      const uploadPromises = processedFiles.map(async (item) => {
        const result = await uploadStreamToCloudinary(
          item.processedBuffer,
          targetFolder,
          item.resourceType,
          item.format,
        );
        successfullyUploaded.push({
          public_id: result.public_id,
          resource_type: item.resourceType,
        });

        return {
          url: result.secure_url,
          public_id: result.public_id,
          originalName: item.file.originalname,
          size: `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`,
          mimetype: item.file.mimetype,
        };
      });

      req.uploadedfiles = await Promise.all(uploadPromises);
      return next();
    } catch (error) {
      // Cleanup in case Cloudinary connection fails midway
      if (successfullyUploaded.length > 0) {
        const deletePromises = successfullyUploaded.map((item) =>
          cloudinary.uploader.destroy(item.public_id, {
            resource_type: item.resource_type === "image" ? "image" : "raw",
            invalidate: true,
          }),
        );
        await Promise.all(deletePromises);
      }

      return next(error);
    }
  });
};
