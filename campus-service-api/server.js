// Entry point: sets up Express, connects to MongoDB and mounts all routes
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Campus Service Request API is running" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// 404 for unknown routes + central error handler (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
