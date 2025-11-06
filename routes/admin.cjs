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
  } catch {
    res.status(400).json({ message: "Add category failed" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch {
    res.status(400).json({ message: "Delete category failed" });
  }
});

// Products
router.post("/products", async (req, res) => {
  try {
    const { name, description, price, imageURL, rating, freshness, stock, categoryId } = req.body;

    // Require valid categoryId
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
  } catch {
    res.status(400).json({ message: "Update product failed" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch {
    res.status(400).json({ message: "Delete product failed" });
  }
});

module.exports = router;


