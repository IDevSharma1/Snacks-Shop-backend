// api/index.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("../routes/auth.cjs");
const adminRoutes = require("../routes/admin.cjs");
const publicRoutes = require("../routes/public.cjs");

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

let isConnected = false;

async function connectDb() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// Lazy DB connection middleware
app.use(async (_req, _res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    console.error("DB connect failed:", err);
    _res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.get("/", (_req, res) => res.json({ ok: true, service: "snackshop-api" }));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", publicRoutes);

export default app;
