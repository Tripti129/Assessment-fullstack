const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/dashboard  (Admin)
// Uses one MongoDB aggregation with $facet to calculate all statistics at once
exports.getDashboard = asyncHandler(async (req, res) => {
  const [result] = await ServiceRequest.aggregate([
    {
      $facet: {
        total: [{ $count: "count" }],
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        byPriority: [{ $group: { _id: "$priority", count: { $sum: 1 } } }],
        byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }],
      },
    },
  ]);

  // Turn [{ _id: "Pending", count: 3 }, ...] into { Pending: 3, ... }
  const toObject = (arr) => Object.fromEntries(arr.map((x) => [x._id, x.count]));
  const byStatus = toObject(result.byStatus);
  const byPriority = toObject(result.byPriority);

  res.json({
    success: true,
    stats: {
      totalRequests: result.total[0]?.count || 0,
      pending: byStatus["Pending"] || 0,
      inProgress: byStatus["In Progress"] || 0,
      resolved: byStatus["Resolved"] || 0,
      highPriority: byPriority["High"] || 0,
      // bonus statistics
      byStatus,
      byPriority,
      byCategory: toObject(result.byCategory),
    },
  });
});

// GET /api/admin/staff  (Admin) - list of staff members, useful for choosing staffId to assign
exports.getStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: { $in: ["staff", "admin"] } }).select("name email role department");
  res.json({ success: true, count: staff.length, staff });
});
