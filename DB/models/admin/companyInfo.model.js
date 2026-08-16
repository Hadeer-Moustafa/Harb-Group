import mongoose from "mongoose";

const companyInfoSchema = new mongoose.Schema(
  {
    nameAr: {
      type: String,
      required: [true, "Company Arabic name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    nameEn: {
      type: String,
      required: [true, "Company English name is required"],
      trim: true,
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    descriptionAr: {
      type: String,
      trim: true,
      maxlength: [1000, "Description must not exceed 1000 characters"],
    },
    descriptionEn: {
      type: String,
      trim: true,
      maxlength: [2000, "Description must not exceed 1000 characters"],
    },
    logo: {
      url: {
        type: String,
        trim: true,
      },
      public_id: {
        type: String,
        trim: true,
      },
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, "Address must not exceed 300 characters"],
    },
    email: {
      type: String,
      required: [true, "Company Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Company Email must be valid Email ",
      ],
    },
    phoneNumbers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    googleMapsUrl: {
      type: String,
      trim: true,
    },
    workingHours: {
      type: String,
      default: "",
    },
    socialMediaLinks: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false,
  },
);

export const CompanyInfo = mongoose.model("CompanyInfo", companyInfoSchema);
