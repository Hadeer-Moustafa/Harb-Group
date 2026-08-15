import { catchError } from "../../../utils/catchError.js";
import { Projects } from "../../../../DB/models/admin/project.model.js";
import { sendSuccess } from "../../../utils/successResponse.js";

export const createProject = catchError(async (req, res, next) => {
  const newProject = await Projects.create({
    ...req.body,
  });
  return sendSuccess(res, 201, "Project created successfully", newProject);
});

export const updateProject = catchError (async (req , res , next) => {
    const {projectId} = req.params;
    const updatedProject = await Projects.findByIdAndUpdate(projectId,{$set:req.body});
    if(!updatedProject) {
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
    return sendSuccess(res,200,"Project updated successfully",updateProject);
})