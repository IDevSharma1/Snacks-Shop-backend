// routes/public.cjs
const express = require("express");
const Product = require("../models/Product.cjs");
const Category = require("../models/Category.cjs");

const router = express.Router();

router.get("/categories", async (_req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch categories", error: e.message });
  }
});

router.get("/products", async (req, res) => {
  try {
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
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch products", error: e.message });
  }
});

module.exports = router;
