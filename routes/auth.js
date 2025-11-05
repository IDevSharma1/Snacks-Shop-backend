// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, adminKey } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: "User exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const role = adminKey === "MAKE_ME_ADMIN" ? "ADMIN" : "USER";
    const u = await User.create({ username, email, passwordHash, role });

    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({ token, username: u.username, role: u.role });
  } catch (e) {
    res.status(400).json({ message: "Register failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, username: user.username, role: user.role });
  } catch {
    res.status(400).json({ message: "Login failed" });
  }
});

export default router;
