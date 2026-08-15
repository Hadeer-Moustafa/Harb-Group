import { catchError } from "../../../utils/catchError.js";
import { Products } from "../../../../DB/models/admin/product.model.js";
import { Category } from "../../../../DB/models/admin/category.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import { v2 as cloudinary } from "cloudinary";
import { featuredProducts } from "../../../../DB/models/admin/featuredProducts.model.js";
export const addProduct = catchError(async (req, res, next) => {
  const {
    categoryId,
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    isAvailable,
  } = req.body;
  let displayOrder = req.body.displayOrder;
  const category = await Category.findOne({ _id: categoryId, isActive: true });
  if (!category) {
    return next({
      statusCode: 400,
      message: "Invalid category",
      errors: [
        {
          code: "INVALID_CATEGORY",
          message: "Category does not exists",
          field: "categoryId",
          details: "Category does not exist or is inactive",
        },
      ],
    });
  }
  const oldProduct = await Products.findOne({
    categoryId,
    $or: [{ nameAr }, { nameEn }],
    isAvailable: true,
  });
  const isDuplicateAr = oldProduct?.nameAr === nameAr;
  const duplicateField = isDuplicateAr ? "nameAr" : "nameEn";
  if (oldProduct) {
    return next({
      statusCode: 422,
      message: "product with this name already exists",
      errors: [
        {
          code: "DUPLICATE_NAME",
          message: "product with this name already exists",
          field: duplicateField,
          details: isDuplicateAr
            ? "A product with this Arabic name already exists"
            : "A product with this English name already exists",
        },
      ],
    });
  }
  if (displayOrder && Number(displayOrder) > 0) {
    displayOrder = Number(displayOrder);
    await Products.updateMany(
      { categoryId, displayOrder: { $gte: displayOrder } },
      { $inc: { displayOrder: 1 } },
    );
  } else {
    const lastProduct = await Products.findOne({ categoryId }).sort({
      displayOrder: -1,
    });
    displayOrder =
      lastProduct && lastProduct.displayOrder
        ? lastProduct.displayOrder + 1
        : 1;
  }

  const product = await Products.create({
    categoryId,
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    isAvailable,
    displayOrder,
  });
  return sendSuccess(res, 200, "Product created successfully", product);
});

export const updateProduct = catchError(async (req, res, next) => {
  const { productId } = req.params;
  const {
    categoryId,
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    isAvailable,
  } = req.body;

  let displayOrder = req.body.displayOrder;

  // ensure prroduct found
  const product = await Products.findById(productId);
  if (!product) {
    return next({
      statusCode: 404,
      message: "Product not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Product not found",
        },
      ],
    });
  }

  const targetCategoryId = categoryId || product.categoryId;
  const isCategoryChanged =
    categoryId && categoryId.toString() !== product.categoryId.toString();

  // ensure new category found
  if (isCategoryChanged) {
    const category = await Category.findOne({
      _id: categoryId,
      isActive: true,
    });
    if (!category) {
      return next({
        statusCode: 404,
        message: "Invalid category",
        errors: [
          {
            code: "INVALID_CATEGORY",
            message: "Category does not exist",
            field: "categoryId",
            details: "Category does not exist or is inactive",
          },
        ],
      });
    }
  }

  // Ensure product names are unique within the target category (excluding current product)
  if (nameAr || nameEn) {
    const oldProduct = await Products.findOne({
      categoryId: targetCategoryId,
      $or: [
        { nameAr: nameAr || product.nameAr },
        { nameEn: nameEn || product.nameEn },
      ],
      _id: { $ne: productId },
      isAvailable: true,
    });

    if (oldProduct) {
      const isDuplicateAr = nameAr && oldProduct.nameAr === nameAr;
      const duplicateField = isDuplicateAr ? "nameAr" : "nameEn";
      return next({
        statusCode: 422,
        message: "Product with this name already exists",
        errors: [
          {
            code: "DUPLICATE_NAME",
            message: "Product with this name already exists",
            field: duplicateField,
            details: isDuplicateAr
              ? "A product with this Arabic name already exists"
              : "A product with this English name already exists",
          },
        ],
      });
    }
  }

  // if update display order
  if (
    displayOrder !== undefined &&
    displayOrder !== null &&
    Number(displayOrder) > 0
  ) {
    const newOrder = Number(displayOrder);
    const oldOrder = product.displayOrder;

    if (isCategoryChanged) {
      // Case A: Product moved to a new category
      // Fill the gap in the old category by shifting subsequent items down
      await Products.updateMany(
        { categoryId: product.categoryId, displayOrder: { $gt: oldOrder } },
        { $inc: { displayOrder: -1 } },
      );
      // Make room in the new category by shifting items up
      await Products.updateMany(
        { categoryId: targetCategoryId, displayOrder: { $gte: newOrder } },
        { $inc: { displayOrder: 1 } },
      );
      displayOrder = newOrder;
    } else if (newOrder !== oldOrder) {
      // Case B: Reordering within the same category
      if (newOrder < oldOrder) {
        // Moved up (e.g., from 5 to 2): shift items in between [newOrder, oldOrder - 1] up (+1)
        await Products.updateMany(
          {
            categoryId: targetCategoryId,
            displayOrder: { $gte: newOrder, $lt: oldOrder },
          },
          { $inc: { displayOrder: 1 } },
        );
      } else {
        // Moved down (e.g., from 2 to 5): shift items in between [oldOrder + 1, newOrder] down (-1)
        await Products.updateMany(
          {
            categoryId: targetCategoryId,
            displayOrder: { $gt: oldOrder, $lte: newOrder },
          },
          { $inc: { displayOrder: -1 } },
        );
      }
      displayOrder = newOrder;
    } else {
      displayOrder = oldOrder; // Order remains unchanged
    }
  } else if (isCategoryChanged) {
    // If category changed and no display order specified, move to the end of the new category
    await Products.updateMany(
      {
        categoryId: product.categoryId,
        displayOrder: { $gt: product.displayOrder },
      },
      { $inc: { displayOrder: -1 } },
    );
    const lastProduct = await Products.findOne({
      categoryId: targetCategoryId,
    }).sort({ displayOrder: -1 });
    displayOrder = (lastProduct?.displayOrder ?? 0) + 1;
  } else {
    displayOrder = product.displayOrder; // // Keep existing order
  }

  const updatedProduct = await Products.findByIdAndUpdate(
    productId,
    {
      categoryId: targetCategoryId,
      nameAr: nameAr ?? product.nameAr,
      nameEn: nameEn ?? product.nameEn,
      descriptionAr: descriptionAr ?? product.descriptionAr,
      descriptionEn: descriptionEn ?? product.descriptionEn,
      isAvailable: isAvailable ?? product.isAvailable,
      displayOrder,
    },
    { returnDocument: "after", runValidators: true },
  );

  return sendSuccess(res, 200, "Product updated successfully", updatedProduct);
});

export const deleteProduct = catchError(async (req, res, next) => {
  const product = req.product;
  const { productId } = req.params;
  const featuredProduct = await featuredProducts.findOne({ productId });
  if (featuredProduct) {
    return next({
      statusCode: 409,
      message: "Cannot delete product",
      errors: [
        {
          code: "DEPENDENCY_CONFLICT",
          message:
            "Product is featured on homepage. Remove from featured first.",
        },
      ],
    });
  }
   const folderPath = `Products/${productId}`;
   const pdfPublicId = product.productPdf?.public_id;
   const hasImages = (product.images?.length || 0) > 0;
 (async () => {
    try {
      if (pdfPublicId) {
        await cloudinary.uploader.destroy(pdfPublicId, {
          resource_type: "raw",
          invalidate: true,
        });
      }

      if (hasImages) {
       
        await cloudinary.api.delete_resources_by_prefix(folderPath);
        await cloudinary.api.delete_folder(folderPath);
        console.log(`Folder ${folderPath} deleted successfully from Cloudinary`);
      }
    } catch (error) {
      console.error("Cloudinary Folder Delete Error:", error);
    }
  })();
  await product.deleteOne();
  return res.status(204).send();
});

export const uploadProductImages = catchError(async (req, res, next) => {
  const product = req.product;
  const currentImagesCount = product.images ? product.images.length : 0;
  if (req.uploadedfiles && req.uploadedfiles.length > 0) {
    const imagesWithOrder = req.uploadedfiles.map((img, index) => ({
      ...img,
      displayOrder: currentImagesCount + index + 1,
    }));
    product.images.push(...imagesWithOrder);
  }

  await product.save();
  return sendSuccess(res, 201, "Images uploaded successfully", product.images);
});

export const deleteProductImage = catchError(async (req, res, next) => {
  const product = req.product;
  const { imageId } = req.params;
  const ImageExist = product.images.find(
    (img) => img._id.toString() === imageId,
  );

  if (!ImageExist) {
    return next({
      statusCode: 404,
      message: "Image not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Image not found",
          details: `Image does not exist for this product`,
        },
      ],
    });
  }
  if (product.images.length === 1) {
    return next({
      statusCode: 409,
      message: "Cannot delete image",
      errors: [
        {
          code: "LAST_IMAGE",
          message: "Product must have at least one image",
          details: "This product only have one image you cannot delete it",
        },
      ],
    });
  }
  if (ImageExist.public_id) {
    const imagePublic_id = ImageExist.public_id;
    (async () => {
      try {
        await cloudinary.uploader.destroy(imagePublic_id, {
          resource_type: "image",
          invalidate: true,
        });
      } catch (err) {
        console.error("Cloudinary Image Delete Error:", err.message);
      }
    })();
  }
  product.images.pull({ _id: imageId });
  product.images.forEach((img, index) => {
    img.displayOrder = index + 1;
  });
  await product.save();
  return res.status(204).send();
});

export const uploadProductFile = catchError(async (req, res, next) => {
  const product = req.product;
  if (product.productPdf && product.productPdf.public_id) {
    //remove old file from cloudinary
    await cloudinary.uploader.destroy(product.productPdf.public_id, {
      resource_type: "raw",
      invalidate: true,
    });
  }

  if (req.uploadedfiles && req.uploadedfiles.length > 0) {
    product.productPdf.pdfURL = req.uploadedfiles[0].url;
    product.productPdf.public_id = req.uploadedfiles[0].public_id;
    product.productPdf.fileName = req.uploadedfiles[0].originalName;
    product.productPdf.fileSize = req.uploadedfiles[0].size;
  }
  await product.save();
  return sendSuccess(res, 201, "PDF uploaded successfully", product.productPdf);
});

export const deleteProductFile = catchError(async (req, res, next) => {
  const product = req.product;

  if (!product.productPdf?.public_id) {
    return next({
      statusCode: 404,
      message: "Pdf not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Pdf not found",
          details: `No PDF associated with this product`,
        },
      ],
    });
  }
  const pdfPublicId = product.productPdf.public_id;
   (async () => {
      try {
        await cloudinary.uploader.destroy(pdfPublicId, {
          resource_type: "raw",
          invalidate: true,
        });
      } catch (err) {
        console.error("Cloudinary pdf Delete Error:", err.message);
      }
    })();
  
  product.productPdf = undefined;
  await product.save();
  return res.status(204).send();
});
