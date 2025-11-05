const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

let conn;
async function connect() {
  if (!conn) conn = mongoose.connect(process.env.MONGODB_URI, { dbName: "snackshop" });
  return conn;
}
app.use(async (_req, _res, next) => { await connect(); next(); });

app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

module.exports = app;
