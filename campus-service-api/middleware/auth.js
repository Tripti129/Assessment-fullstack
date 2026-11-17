const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// 1) protect: checks the JWT and attaches the logged-in user to req.user
//    Missing / invalid token -> 401 Unauthorized
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    throw new AppError("Not authorized: no token provided", 401);
  }

  const token = header.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Not authorized: invalid or expired token", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("Not authorized: user no longer exists", 401);

  req.user = user;
  next();
});

// 2) allowRoles: role-check middleware, e.g. allowRoles("admin")
//    Wrong role -> 403 Forbidden
const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError(`Access denied: only ${roles.join(" / ")} can do this`, 403));
  }
  next();
};

module.exports = { protect, allowRoles };
