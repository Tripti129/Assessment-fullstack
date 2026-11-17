const router = require("express").Router();
const { protect, allowRoles } = require("../middleware/auth");
const { getDashboard, getStaff } = require("../controllers/adminController");

// Only logged-in admins
router.use(protect, allowRoles("admin"));

router.get("/dashboard", getDashboard);
router.get("/staff", getStaff);

module.exports = router;
