// Unknown route -> 404
function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler: turns every error into a clear JSON response
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";

  // Mongoose validation error (e.g. missing title, wrong category) -> 400
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // Invalid ObjectId in the URL, e.g. /api/requests/abc -> 400
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid id: ${err.value}`;
  }

  // Duplicate unique field (email already registered) -> 409
  if (err.code === 11000) {
    statusCode = 409;
    message = "Email is already registered";
  }

  // Bad JSON in request body -> 400
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  if (statusCode === 500) console.error(err);
  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
