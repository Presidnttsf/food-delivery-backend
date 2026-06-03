// Handles Mongoose CastError (invalid ObjectId), ValidationError, and custom errors
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = "Validation failed";
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  const payload = { success: false, message };
  if (errors.length > 0) payload.errors = errors;

  if (process.env.NODE_ENV === "development") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
