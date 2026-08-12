import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },
    nameEn: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: false,
    },
    descriptionEn: {
      type: String,
      required: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type:String
        },
        displayOrder: {
          type: Number,
        },
      },
    ],
    productPdf: {
      pdfURL: { type: String,},
       public_id: {type:String},
      fileName: { type: String },
      fileSize: { type: String },
    },
  },
  { timestamps: true },
);
//prevent same name in same category
productSchema.index({ categoryId: 1, nameAr: 1 }, { unique: true });
productSchema.index({ categoryId: 1, nameEn: 1 }, { unique: true });


export const Products = mongoose.model("Products", productSchema);
