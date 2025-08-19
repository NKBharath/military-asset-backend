const express = require("express");
const {loginAdmin, getAdminDashboard, setAdminAssets, transferAsset} = require("../controller/adminController");
const router = express.Router();
const { adminlogin } = require("../middleware/authmiddleware");
const {adminonly} = require("../middleware/rolemiddleware");

router.post("/login",  loginAdmin);
router.get('/dashboard', adminlogin, adminonly, getAdminDashboard);
router.post('/assets', adminlogin, adminonly, setAdminAssets);
router.post('/transfer',  transferAsset);
module.exports = router ;