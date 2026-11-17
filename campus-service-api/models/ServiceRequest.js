const mongoose = require("mongoose");
const { STATUSES } = require("../utils/statusFlow");

const CATEGORIES = [
  "Computer",
  "Classroom Equipment",
  "Internet",
  "Hostel Maintenance",
  "Electrical",
  "Library",
  "Other",
];
const PRIORITIES = ["Low", "Medium", "High"];

const serviceRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title can be at most 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: { values: CATEGORIES, message: "Category must be one of: " + CATEGORIES.join(", ") },
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: "Priority must be one of: " + PRIORITIES.join(", ") },
      default: "Medium",
    },
    status: { type: String, enum: STATUSES, default: "Pending" },
    // References to the User collection (ObjectId, not plain strings)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    adminResponse: { type: String, trim: true, default: "" },
  },
  { timestamps: true } // createdAt and updatedAt
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.PRIORITIES = PRIORITIES;
