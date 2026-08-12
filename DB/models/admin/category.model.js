import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    nameAr: {
      type: String,
      require: true,
      unique: true,
    },
    nameEn: {
      type: String,
      require: true,
      unique: true,
    },
    descriptionAr: {
      type: String,
      default: "",
    },
    descriptionEn: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
export const Category = mongoose.model("Category",categorySchema);