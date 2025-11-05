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
app.use(async (_req, _res, next) => {
try { await connect(); next(); }
catch (e) { console.error("DB connect failed:", e); next(e); }
});

app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Final error handler to avoid hard crashes
app.use((err, _req, res, _next) => {
console.error("Unhandled error:", err);
res.status(500).json({ message: "Server error", error: err?.message || "Unknown" });
});

module.exports = app;