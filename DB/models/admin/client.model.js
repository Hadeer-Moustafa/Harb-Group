import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    nameAr: {
      type: String,
      require: true,
    },
    nameEn: {
      type: String,
      require: true,
    },
    logo: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: Number,
  },
  { timestamps: true },
);

export const Clients = mongoose.model("Clients", clientSchema);
