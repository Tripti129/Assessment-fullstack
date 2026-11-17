const mongoose = require("mongoose");
const ServiceRequest = require("../models/ServiceRequest");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { STATUSES, ALLOWED_NEXT, canMove } = require("../utils/statusFlow");
const { PRIORITIES } = require("../models/ServiceRequest");

// Fields of related users to include in responses (populate)
const USER_FIELDS = "name email role department";

// Helper: find a request by id or throw 400/404
async function findRequestOr404(id) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(`Invalid request id: ${id}`, 400);
  const request = await ServiceRequest.findById(id);
  if (!request) throw new AppError("Request not found", 404);
  return request;
}

// Helper: is the logged-in user the creator of this request?
function isOwner(request, user) {
  return request.createdBy.toString() === user._id.toString();
}

// POST /api/requests  (Student)
exports.createRequest = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  // Students only give title, description, category.
  // status starts as "Pending" and priority is set later by admin.
  const request = await ServiceRequest.create({
    title,
    description,
    category,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: "Request created", request });
});

// GET /api/requests  (Student / Admin)
// Student -> only their own requests
// Admin   -> all requests, with ?search=&status=&priority=&category=
exports.getRequests = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === "student") {
    filter.createdBy = req.user._id;
  } else {
    const { status, priority, category, search } = req.query;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      // case-insensitive search in title or description (escape special regex characters)
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safe, $options: "i" } },
        { description: { $regex: safe, $options: "i" } },
      ];
    }
  }

  const requests = await ServiceRequest.find(filter)
    .populate("createdBy", USER_FIELDS)
    .populate("assignedTo", USER_FIELDS)
    .sort({ createdAt: -1 });

  res.json({ success: true, count: requests.length, requests });
});

// GET /api/requests/:id  (Owner / Admin)
exports.getRequestById = asyncHandler(async (req, res) => {
  const request = await findRequestOr404(req.params.id);

  if (req.user.role !== "admin" && !isOwner(request, req.user)) {
    throw new AppError("Access denied: you can only view your own requests", 403);
  }

  await request.populate([
    { path: "createdBy", select: USER_FIELDS },
    { path: "assignedTo", select: USER_FIELDS },
  ]);
  res.json({ success: true, request });
});

// PUT /api/requests/:id  (Owner, only while Pending)
exports.updateRequest = asyncHandler(async (req, res) => {
  const request = await findRequestOr404(req.params.id);

  if (!isOwner(request, req.user)) {
    throw new AppError("Access denied: you can only update your own requests", 403);
  }
  if (request.status !== "Pending") {
    throw new AppError(`Request cannot be updated because it is already "${request.status}"`, 400);
  }

  // Owner may only change these three fields
  const { title, description, category } = req.body;
  if (title === undefined && description === undefined && category === undefined) {
    throw new AppError("Provide at least one of: title, description, category", 400);
  }
  if (title !== undefined) request.title = title;
  if (description !== undefined) request.description = description;
  if (category !== undefined) request.category = category;

  await request.save(); // runs schema validation
  res.json({ success: true, message: "Request updated", request });
});

// DELETE /api/requests/:id  (Owner while Pending / Admin any time)
exports.deleteRequest = asyncHandler(async (req, res) => {
  const request = await findRequestOr404(req.params.id);

  if (req.user.role !== "admin") {
    if (!isOwner(request, req.user)) {
      throw new AppError("Access denied: you can only delete your own requests", 403);
    }
    if (request.status !== "Pending") {
      throw new AppError(`Request cannot be deleted because it is already "${request.status}"`, 400);
    }
  }

  await request.deleteOne();
  res.json({ success: true, message: "Request deleted" });
});

// PUT /api/requests/:id/status  (Admin)
// Body: { status?, priority?, adminResponse? }  - at least one is required
exports.updateStatus = asyncHandler(async (req, res) => {
  const request = await findRequestOr404(req.params.id);
  const { status, priority, adminResponse } = req.body;

  if (status === undefined && priority === undefined && adminResponse === undefined) {
    throw new AppError("Provide at least one of: status, priority, adminResponse", 400);
  }

  if (status !== undefined) {
    if (!STATUSES.includes(status)) {
      throw new AppError(`Invalid status. Allowed values: ${STATUSES.join(", ")}`, 400);
    }
    // Enforce the workflow, e.g. Pending -> Closed is rejected
    if (!canMove(request.status, status)) {
      const next = ALLOWED_NEXT[request.status];
      throw new AppError(
        `Invalid status change: "${request.status}" -> "${status}". ` +
          (next.length ? `Allowed next: ${next.join(", ")}` : `"${request.status}" is a final status`),
        400
      );
    }
    // A request must have a staff member before it can be "Assigned"
    if (status === "Assigned" && !request.assignedTo) {
      throw new AppError("Assign a staff member first using PUT /api/requests/:id/assign", 400);
    }
    request.status = status;
  }

  if (priority !== undefined) {
    if (!PRIORITIES.includes(priority)) {
      throw new AppError(`Invalid priority. Allowed values: ${PRIORITIES.join(", ")}`, 400);
    }
    request.priority = priority;
  }

  if (adminResponse !== undefined) request.adminResponse = adminResponse;

  await request.save();
  res.json({ success: true, message: "Request updated", request });
});

// PUT /api/requests/:id/assign  (Admin)
// Body: { staffId }
// Request must be "Under Review" (or already "Assigned" to re-assign). Status becomes "Assigned".
exports.assignRequest = asyncHandler(async (req, res) => {
  const request = await findRequestOr404(req.params.id);
  const { staffId } = req.body;

  if (!staffId) throw new AppError("staffId is required", 400);
  if (!mongoose.isValidObjectId(staffId)) throw new AppError(`Invalid staffId: ${staffId}`, 400);

  const staff = await User.findById(staffId);
  if (!staff) throw new AppError("Staff member not found", 404);
  if (!["staff", "admin"].includes(staff.role)) {
    throw new AppError("Requests can only be assigned to staff or admin users", 400);
  }

  if (!["Under Review", "Assigned"].includes(request.status)) {
    throw new AppError(
      `Only requests that are "Under Review" can be assigned (current status: "${request.status}")`,
      400
    );
  }

  request.assignedTo = staff._id;
  request.status = "Assigned";
  await request.save();
  await request.populate("assignedTo", USER_FIELDS);

  res.json({ success: true, message: `Request assigned to ${staff.name}`, request });
});
