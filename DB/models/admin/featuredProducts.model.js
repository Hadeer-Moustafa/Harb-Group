import mongoose from "mongoose";

const featuredProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    displayOrder: { type: Number, required: true },
  },
  { timestamps: true },
);
export const featuredProducts = mongoose.model(
  "featuredProducts",
  featuredProductSchema,
);
