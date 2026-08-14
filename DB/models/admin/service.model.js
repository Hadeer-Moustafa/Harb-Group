import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
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
      require: true,
    },
    descriptionEn: {
      type: String,
      require: true,
    },
    displayOrder: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true },
);

export const Services = mongoose.model("Services", serviceSchema);
