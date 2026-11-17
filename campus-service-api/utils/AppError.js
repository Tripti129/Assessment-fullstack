// Custom error with an HTTP status code, e.g. throw new AppError("Not found", 404)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
