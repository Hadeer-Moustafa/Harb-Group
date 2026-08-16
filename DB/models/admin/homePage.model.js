import mongoose from "mongoose";

const homepageSettingsSchema = new mongoose.Schema(
  {
    heroImage: {
      type: {
        url: { type: String, trim: true },
        public_id: { type: String, trim: true },
        responsiveVariants: {
          mobile: { type: String, trim: true },
          tablet: { type: String, trim: true },
          desktop: { type: String, trim: true },
        },
      },
      default: undefined,
    },
    heroTitleAr: {
      type: String,
      trim: true,
      maxlength: [150, "Hero title in Arabic must not exceed 150 characters"],
      default: "",
      require: [true, "Hero title in Arabic is require"],
    },
    heroTitleEn: {
      type: String,
      trim: true,
      maxlength: [150, "Hero title in English must not exceed 150 characters"],
      default: "",
      require: [true, "Hero title in English is require"],
    },
    heroSubtitleAr: {
      type: String,
      trim: true,
      maxlength: [
        300,
        "Hero subtitle in Arabic must not exceed 300 characters",
      ],
      default: "",
    },
    heroSubtitleEn: {
      type: String,
      trim: true,
      maxlength: [
        300,
        "Hero subtitle in English must not exceed 300 characters",
      ],
      default: "",
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false,
  },
);

export const HomepageSettings = mongoose.model(
  "HomepageSettings",
  homepageSettingsSchema,
);
