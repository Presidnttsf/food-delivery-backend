const express = require("express");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const path = require("path");
const cors = require("cors");

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://food-delivery-frontend-opal.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Static Images
app.use(
  "/images",
  express.static(path.join(__dirname, "assets/images"))
);

// API routes
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;