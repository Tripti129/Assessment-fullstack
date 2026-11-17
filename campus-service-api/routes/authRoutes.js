const router = require("express").Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register); // Public
router.post("/login", login); // Public

module.exports = router;
