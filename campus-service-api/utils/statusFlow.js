// Status workflow:
// Pending -> Under Review -> Assigned -> In Progress -> Resolved -> Closed
// A request can be Rejected from Pending or Under Review.

const STATUSES = ["Pending", "Under Review", "Assigned", "In Progress", "Resolved", "Closed", "Rejected"];

// For each status, the list of statuses it is allowed to move to
const ALLOWED_NEXT = {
  "Pending": ["Under Review", "Rejected"],
  "Under Review": ["Assigned", "Rejected"],
  "Assigned": ["In Progress"],
  "In Progress": ["Resolved"],
  "Resolved": ["Closed"],
  "Closed": [],
  "Rejected": [],
};

function canMove(from, to) {
  return ALLOWED_NEXT[from].includes(to);
}

module.exports = { STATUSES, ALLOWED_NEXT, canMove };
