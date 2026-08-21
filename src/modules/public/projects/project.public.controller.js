import { catchError } from "../../../utils/catchError.js";
import { Projects } from "../../../../DB/models/admin/project.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const getAllProjects = catchError(async (req, res, next) => {
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const projects = await Projects.find({ isActive: true })
    .select("_id nameAr nameEn  images completionYear")
    .sort({ createdAt: -1 })
    .lean();

  const projectsData = projects.map((project) => ({
    _id: project._id,
    name:
      lang === "ar"
        ? project.nameAr || project.nameEn
        : project.nameEn || project.nameAr,
    image: project.images[0]?.url,
    completionYear: project.completionYear,
  }));

  return sendSuccess(res, 200, "Projects retrieved successfully", {
    projects: projectsData,
  });
});

export const getProjectById = catchError(async (req, res, next) => {
  const { projectId } = req.params;
  const rawLang =
    req.headers["accept-language"] || req.headers["language"] || "en";
  const lang = rawLang.toLowerCase().startsWith("ar") ? "ar" : "en";

  const project = await Projects.findOne({ _id: projectId, isActive: true })
    .select(
      "_id nameAr nameEn images descriptionAr descriptionEn clientName completionYear",
    )
    .lean();
  if (!project) {
    return next({
      statusCode: 404,
      message: "Project not found",
      errors: [
        {
          code: "NOT_FOUND",
          message: "Project does not exist",
          field: "projectId",
          details: "Project with this ID does not exist",
        },
      ],
    });
  }
  const formattedProject = {
    _id: project._id,
    name:
      lang === "ar"
        ? project.nameAr || project.nameEn
        : project.nameEn || project.nameAr,
    description:
      lang === "ar"
        ? project.descriptionAr || project.descriptionEn
        : project.descriptionEn || project.descriptionAr,
    images: project.images?.map((img) => img.url) || [],
    completionYear: project.completionYear,
    clientName: project.clientName,
  };

  return sendSuccess(res, 200, "Project retrieved successfully", {
    project: formattedProject,
  });
});
