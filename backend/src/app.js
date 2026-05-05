const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : "*",
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Team Task Manager API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must have 4 parameters)
app.use((error, _req, res, _next) => {
  console.error("Error:", error);
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
});

module.exports = app;
