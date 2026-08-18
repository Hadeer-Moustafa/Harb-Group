import { catchError } from "../../../utils/catchError.js";
import { Projects } from "../../../../DB/models/admin/project.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";
import { v2 as cloudinary } from "cloudinary";
import { featuredProjects } from "../../../../DB/models/admin/featuredProjects.model.js";

export const createProject = catchError(async (req, res, next) => {
  const newProject = await Projects.create({
    ...req.body,
  });
  return sendSuccess(res, 201, "Project created successfully", newProject);
});

export const updateProject = catchError(async (req, res, next) => {
  const { projectId } = req.params;
  const updatedProject = await Projects.findByIdAndUpdate(
    projectId,
    {
      $set: req.body,
    },
    { returnDocument: "after", runValidators: true },
  );
  if (!updatedProject) {
    return next({
      statusCode: 404,
      message: "project not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "project not found",
        },
      ],
    });
  }
  return sendSuccess(res, 200, "Project updated successfully", updateProject);
});

export const uploadProjectImages = catchError(async (req, res, next) => {
  const project = req.project;
  const currentImagesCount = project.images ? project.images.length : 0;
  if (req.uploadedfiles && req.uploadedfiles.length > 0) {
    const imagesWithOrder = req.uploadedfiles.map((img, index) => ({
      ...img,
      displayOrder: currentImagesCount + index + 1,
    }));
    project.images.push(...imagesWithOrder);
  }

  await project.save();
  return sendSuccess(res, 201, "Images uploaded successfully", {
    projectId: project._id,
    uploadedImages: project.images,
  });
});

export const deleteProjectImage = catchError(async (req, res, next) => {
  const project = req.project;
  const { imageId } = req.params;
  const ImageExist = project.images.find(
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
          details: `Image does not exist for this project`,
        },
      ],
    });
  }
  const imagePublicId = ImageExist.public_id;
  if (imagePublicId) {
    (async () => {
      try {
        await cloudinary.uploader.destroy(imagePublicId, {
          resource_type: "image",
          invalidate: true,
        });
      } catch (err) {
        console.error("Cloudinary Image Delete Error:", err.message);
      }
    })();
  }
  project.images.pull({ _id: imageId });
  project.images.forEach((img, index) => {
    img.displayOrder = index + 1;
  });
  await project.save();
  return res.status(204).send();
});

export const deleteProject = catchError(async (req, res, next) => {
  const project = req.project;
  const { projectId } = req.params;
  const featuredProject = await featuredProjects.findOne({ projectId });
  if (featuredProject) {
    return next({
      statusCode: 409,
      message: "Cannot delete project",
      errors: [
        {
          code: "DEPENDENCY_CONFLICT",
          message:
            "project is featured on homepage. Remove from featured first.",
        },
      ],
    });
  }

  if (project.images?.length > 0) {
    const folderPath = `Projects/${projectId}`;

    (async () => {
      try {
        await cloudinary.api.delete_resources_by_prefix(folderPath);
        await cloudinary.api.delete_folder(folderPath);
        console.log(`Cloudinary folder ${folderPath} deleted successfully.`);
      } catch (err) {
        console.error("Cloudinary background delete error:", err.message);
      }
    })();
  }

  await project.deleteOne();
  return res.status(204).send();
});

export const getAllProjects = catchError(async (req, res, next) => {
  const { search } = req.query;
  const pageNumber = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 20;

  const filter = {};

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { nameAr: searchRegex },
      { nameEn: searchRegex },
      { clientName: searchRegex },
    ];
  }
  const skip = (pageNumber - 1) * pageSize;
  const [projects, totalCount] = await Promise.all([
    Projects.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .select(
        "_id nameAr nameEn images.url clientName isFeatured isActive completionYear",
      ),
    Projects.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  return sendSuccess(res, 200, "Projects retrieved successfully", {
    projects,
    pagination: {
      currentPage: pageNumber,
      totalCount,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
  });
});
