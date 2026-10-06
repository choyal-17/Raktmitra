const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors({ origin: "*" }));
app.use(express.json());

// ===============================
// Routes
// ===============================
const authRoutes = require("./routes/auth");
const donorRoutes = require("./routes/donors");
const patientRoutes = require("./routes/patients");
const bankRoutes = require("./routes/banks");
const campRoutes = require("./routes/camps");
const requestRoutes = require("./routes/requests");

// ===============================
// Mount Routes
// ===============================
app.use("/", authRoutes);
app.use("/", donorRoutes);
app.use("/", patientRoutes);
app.use("/", bankRoutes);

// Blood Camp APIs
app.use("/api/camps", campRoutes);

// Blood Request APIs
app.use("/api/requests", requestRoutes);

// ===============================
// Health Check
// ===============================
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "RaktMitra API running ✅",
  });
});

// ===============================
// MongoDB Connection + Server
// ===============================
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });