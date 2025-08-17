const express = require("express");
const {loginAdmin, getAdminDashboard} = require("../controller/adminController");
const router = express.Router();
const { adminlogin } = require("../middleware/authmiddleware");
const {adminonly} = require("../middleware/rolemiddleware");

router.post("/login",  loginAdmin);
router.get('/dashboard', adminlogin, adminonly, getAdminDashboard);
module.exports = router ;