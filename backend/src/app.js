const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Allowed origins (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

// CORS configuration (single clean version)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / mobile apps

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Health check route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Team Task Manager API is running 🚀"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((error, _req, res, _next) => {
  console.error("Error:", error.message);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
});

module.exports = app;
