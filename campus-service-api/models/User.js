const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    // select: false -> password is never returned in queries unless asked for
    password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },
    // staff = maintenance / IT staff that admin can assign requests to
    role: { type: String, enum: ["student", "admin", "staff"], default: "student" },
    department: { type: String, trim: true, default: "" },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Hash the password before saving (only when it was changed)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare a plain password with the stored hash
userSchema.methods.matchPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
