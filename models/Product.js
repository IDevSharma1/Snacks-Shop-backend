// backend/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    imageURL: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    freshness: { type: String, default: "" },
    stock: { type: Number, default: 100 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
