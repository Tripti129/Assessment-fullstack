const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/auth");
const c = require("../controllers/requestController");

// Every route below needs a valid JWT
router.use(protect);

router.post("/", allowRoles("student"), c.createRequest); // Student
router.get("/", allowRoles("student", "admin"), c.getRequests); // Student (own) / Admin (all)
router.get("/:id", c.getRequestById); // Owner / Admin (checked in controller)
router.put("/:id", allowRoles("student"), c.updateRequest); // Owner (checked in controller)
router.delete("/:id", c.deleteRequest); // Owner / Admin (checked in controller)

router.put("/:id/status", allowRoles("admin"), c.updateStatus); // Admin
router.put("/:id/assign", allowRoles("admin"), c.assignRequest); // Admin

module.exports = router;
