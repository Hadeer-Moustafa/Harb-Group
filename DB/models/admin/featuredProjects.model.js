import mongoose from "mongoose";

const featuredProjectsSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    displayOrder: { type: Number, required: true },
  },
  { timestamps: true },
);
export const featuredProjects = mongoose.model(
  "featuredProjects",
  featuredProjectsSchema,
);
