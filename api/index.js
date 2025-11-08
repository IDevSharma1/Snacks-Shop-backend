const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("../routes/auth.cjs");
const adminRoutes = require("../routes/admin.cjs");
const publicRoutes = require("../routes/public.cjs");

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

let isConnected = false;

async function connectDBOnce() {
  if (isConnected) return;
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "snackshop" });
  isConnected = true;
  console.log("MongoDB connected (Vercel)");
}

app.get("/", (_req, res) => res.json({ ok: true, service: "snackshop-api" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(async (_req, _res, next) => {
  try {
    await connectDBOnce();
    next();
  } catch (e) {
    console.error("DB connect failed:", e);
    next(e);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

app.use((err, _req, res, _next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Server error", error: err?.message || "Unknown" });
});

module.exports = app;
