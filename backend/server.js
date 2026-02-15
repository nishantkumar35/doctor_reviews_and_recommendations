require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const authRoute = require("./route/authRoutes");
const doctorRoute = require("./route/doctorRoutes");
const reviewRoute = require("./route/reviewRoutes");
const userRoute = require("./route/userRoutes");
const aiRoute = require("./route/searchRoutes");
const { loadModel } = require("./ai/aiClassifier");

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load AI model
loadModel().then(() => console.log("AI Model loaded"));

// Connect DB
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Error:", err));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/review", reviewRoute);
app.use("/api/user", userRoute);
app.use("/api/ai", aiRoute);

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
