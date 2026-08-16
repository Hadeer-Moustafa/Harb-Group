import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    nameAr: {
      type: String,
      require: true,
    },
    nameEn: {
      type: String,
      require: true,
    },
    descriptionAr: {
      type: String,
    },
    descriptionEn: {
      type: String,
    },
    completionYear: {
      type: Number,
      require: true,
      validate: {
        validator: function (v) {
          return (
            Number.isInteger(v) && v >= 1900 && v <= new Date().getFullYear()
          );
        },
        message: (props) =>
          `${props.value} is not a valid year! Must be between 1900 and ${new Date().getFullYear()}`,
      },
    },
    clientName: {
      type: String,
      require: true,
    },
    images: [
      {
        url: String,
        public_id: String,
        displayOrder: Number,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Projects = mongoose.model("Projects", projectSchema);
