const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// Create a JWT that stores the user id and role
function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

// Data sent back to the client (never the password)
function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department };
}

// POST /api/auth/register  (Public)
// Anyone who registers is a student. Admin/staff accounts are created by the seed script,
// so nobody can make themselves admin through this endpoint.
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, department } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError("Email is already registered", 409);

  const user = await User.create({ name, email, password, department, role: "student" });

  res.status(201).json({ success: true, message: "Registered successfully", token: createToken(user), user: publicUser(user) });
});

// POST /api/auth/login  (Public)
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // password has select:false in the schema, so ask for it explicitly
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  res.json({ success: true, message: "Login successful", token: createToken(user), user: publicUser(user) });
});
