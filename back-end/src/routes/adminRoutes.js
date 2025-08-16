const express = require("express");
const {loginAdmin, getAdminDashboard} = require("../controller/adminController");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");

router.post("/login",  loginAdmin);
router.get('/dashboard', protect, getAdminDashboard);
module.exports = router ;