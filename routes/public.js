const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");

const router = express.Router();

// List categories
router.get("/categories", async (_req, res) => {
  const categories = await Category.find().sort("name");
  res.json(categories);
});

// Products with optional filters and pagination
// /api/products?categoryId=...&q=...&page=1&limit=24
router.get("/products", async (req, res) => {
  const { categoryId, q, page = 1, limit = 24 } = req.query;
  const query = {};
  if (categoryId) query.categoryId = categoryId;
  if (q) query.name = { $regex: q, $options: "i" };

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const lim = Math.min(Math.max(parseInt(limit) || 24, 1), 100);
  const skip = (pageNum - 1) * lim;

  const [items, total] = await Promise.all([
    Product.find(query).skip(skip).limit(lim),
    Product.countDocuments(query)
  ]);

  res.json({ items, total, page: pageNum, pages: Math.ceil(total / lim) });
});

module.exports = router;
