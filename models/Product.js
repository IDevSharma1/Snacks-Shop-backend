// backend/models/Product.js
const mongoose = require("mongoose");

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

module.exports = mongoose.model("Product", ProductSchema);
