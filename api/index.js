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

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes);

let isConnected = false;
async function connectDbOnce() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected (Vercel)");
}

connectDbOnce().catch((err) => console.error("Mongo error", err));

export default app;
