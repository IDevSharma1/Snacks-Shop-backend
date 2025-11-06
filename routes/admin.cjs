// routes/admin.cjs
const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/auth.cjs");
const Product = require("../models/Product.cjs");
const Category = require("../models/Category.cjs");

const router = express.Router();
router.use(verifyToken, verifyAdmin);

// Categories
router.post("/categories", async (req, res) => {
  try {
    const cat = await Category.create({ name: req.body.name });
    res.status(201).json(cat);
  } catch (e) {
    res.status(400).json({ message: "Add category failed", error: e.message });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (e) {
    res.status(400).json({ message: "Delete category failed", error: e.message });
  }
});

// Products
router.post("/products", async (req, res) => {
  try {
    const { name, description, price, imageURL, rating, freshness, stock, categoryId } = req.body;

    if (!categoryId) return res.status(400).json({ message: "categoryId is required" });
    const cat = await Category.findById(categoryId);
    if (!cat) return res.status(400).json({ message: "Invalid categoryId" });

    const p = await Product.create({ name, description, price, imageURL, rating, freshness, stock, categoryId });
    res.status(201).json(p);
  } catch (e) {
    res.status(400).json({ message: "Add product failed", error: e.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (e) {
    res.status(400).json({ message: "Update product failed", error: e.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (e) {
    res.status(400).json({ message: "Delete product failed", error: e.message });
  }
});

module.exports = router;
