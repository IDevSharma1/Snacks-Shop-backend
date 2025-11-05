// backend/routes/public.js
import express from "express";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const router = express.Router();

// List categories
router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    res.json(categories);
  } catch (e) { next(e); }
});

// /api/products?categoryId=...&q=...&page=1&limit=24
router.get("/products", async (req, res, next) => {
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
  } catch (e) { next(e); }
});

export default router;
