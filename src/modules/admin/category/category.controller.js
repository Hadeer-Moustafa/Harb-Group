import { catchError } from "../../../utils/catchError.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import { Category } from "../../../../DB/models/admin/category.model.js";
import { Products } from "../../../../DB/models/admin/product.model.js";

export const createCategory = catchError(async (req, res, next) => {
  const { nameAr, nameEn, descriptionAr, descriptionEn, displayOrder } =
    req.body;
  const categoryExist = await Category.findOne({
    $or: [{ nameAr }, { nameEn }],
    isActive: true,
  });
  if (categoryExist) {
    const isDuplicateAr = categoryExist.nameAr === nameAr;
    const duplicateField = isDuplicateAr ? "nameAr" : "nameEn";
    return next({
      statusCode: 409,
      message: "Category already exists",
      errors: [
        {
          code: "DUPLICATE_NAME",
          message: "Category already exists",
          field: duplicateField,
          details: isDuplicateAr
            ? "A category with this Arabic name already exists"
            : "A category with this English name already exists",
        },
      ],
    });
  }
  const newCategory = await Category.create({
    nameAr,
    nameEn,
    descriptionAr,
    descriptionEn,
    displayOrder,
  });
  return sendSuccess(res, 200, "Category created successfully", {
    newCategory,
  });
});

export const updateCategory = catchError(async (req, res, next) => {
  const categoryID = req.params.id;
  const category = await Category.findOne({ _id: categoryID, isActive: true });
  if (!category) {
    return next({
      statusCode: 404,
      message: "Category not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Category not found",
          field: "id",
          details: "this category does not exist may be deleted",
        },
      ],
    });
  }
  const product = await Products.find({
    categoryId: categoryID,
    isAvailable: true,
  });
  if (product.length > 0) {
    return next({
      statusCode: 409,
      message: "Cannot update category",
      errors: [
        {
          code: "DEPENDENCY_CONFLICT",
          message: `Category has ${product.length} associated products`,
          details:
            "This category has active products. Deactivate products first.",
        },
      ],
    });
  }
  const { nameAr, nameEn, descriptionAr, descriptionEn, displayOrder } =
    req.body;
  const categoryExist = await Category.findOne({
    _id: { $ne: categoryID },
    $or: [{ nameAr }, { nameEn }],
    isActive: true,
  });
  if (categoryExist) {
    const isDuplicateAr = categoryExist.nameAr === nameAr;
    const duplicateField = isDuplicateAr ? "nameAr" : "nameEn";
    return next({
      statusCode: 409,
      message: "Category already exists",
      errors: [
        {
          code: "DUPLICATE_NAME",
          message: "Category already exists",
          field: duplicateField,
          details: isDuplicateAr
            ? "A category with this Arabic name already exists"
            : "A category with this English name already exists",
        },
      ],
    });
  }
  const newCategory = await Category.findByIdAndUpdate(
    categoryID,
    {
      nameAr: nameAr ?? category.nameAr,
      nameEn: nameEn ?? category.nameEn,
      descriptionAr: descriptionAr ?? category.descriptionAr,
      descriptionEn: descriptionEn ?? category.descriptionEn,
      displayOrder,
    },
    { returnDocument: "after" },
  );
  return sendSuccess(res, 200, "Category updated successfully", newCategory);
});

export const deleteCategory = catchError(async (req, res, next) => {
  const categoryID = req.params.id;
  const category = await Category.findOne({ _id: categoryID, isActive: true });
  if (!category) {
    return next({
      statusCode: 404,
      message: "Category not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Category not found",
          field: "id",
          details: "this category does not exist may be deleted",
        },
      ],
    });
  }
  const product = await Products.find({
    categoryId: categoryID,
    isAvailable: true,
  });
  if (product.length > 0) {
    return next({
      statusCode: 409,
      message: "Cannot delete category",
      errors: [
        {
          code: "DEPENDENCY_CONFLICT",
          message: `Category has ${product.length} associated products`,
          details: "Delete or reassign products before deleting category",
        },
      ],
    });
  }
  category.isActive = false;
  await category.save();
  return res.status(204).send();
});

export const getAllCategories = catchError(async (req, res, next) => {
  const { search } = req.query;
  const pageNumber = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 20;

   const filter = {};
 
   if (search && search.trim() !== "") {
     const searchRegex = new RegExp(search.trim(), "i");
     filter.$or = [
       { nameAr: searchRegex },
       { nameEn: searchRegex },
     ];
   }
   filter.isActive = true;
   const skip = (pageNumber - 1) * pageSize;
  const [ categories , totalCount ] = await Promise.all([
    Category.aggregate([
    
    { $match: filter },
    {
      $lookup: {
        from: 'products',          
        localField: '_id',         
        foreignField: 'categoryId',  
        as: 'productsList',        
      },
    },
     {
      $project: {
        _id: 1,
        nameEn: 1,
        nameAr: 1,
        productsCount: { $size: '$productsList' }, 
        createdAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: pageSize },
  ]),
  Category.countDocuments(filter)
  ]) ;
   const totalPages = Math.ceil(totalCount / pageSize);
   return sendSuccess(res, 200, "Categories retrieved successfully", {
    categories,
    pagination: {
      currentPage: pageNumber,
      totalPages,
       hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    }
  });
});
