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
const redis = require("ioredis");

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://doctor-reviews-and-recommendations.vercel.app",
    ],
    credentials: true,
  }),
);

const redisClient = new redis(process.env.REDIS_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load AI model
loadModel().then(() => console.log("AI Model loaded"));

// Connect DB
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Error:", err));


// Routes
app.use(
  "/api/auth",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  authRoute,
);

app.use(
  "/api/doctor",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  doctorRoute,
);

app.use(
  "/api/review",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  reviewRoute,
);

app.use(
  "/api/user",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  userRoute,
);

app.use(
  "/api/ai",
  (req, res, next) => {
    req.redisClient = redisClient;
    next();
  },
  aiRoute,
);

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
