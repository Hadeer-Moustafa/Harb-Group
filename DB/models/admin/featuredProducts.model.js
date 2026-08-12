import mongoose from 'mongoose'

const featuredProductSchema = new mongoose.Schema ({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  displayOrder: { type: Number, required: true }

});
export const featuredProducts = mongoose.model("featuredProducts", featuredProductSchema);