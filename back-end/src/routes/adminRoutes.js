const express = require("express");
const {loginAdmin, getAdminDashboard, setAdminAssets, transferAsset, getAssetsData, getBaseData, fetchTransactions} = require("../controller/adminController");
const router = express.Router();
const { adminlogin } = require("../middleware/authmiddleware");
const {adminonly} = require("../middleware/rolemiddleware");

router.post("/login",  loginAdmin);
router.get('/dashboard', adminlogin, adminonly, getAdminDashboard);
router.get('/assetsdata', adminlogin, adminonly, getAssetsData);
router.get('/basesdata', adminlogin, adminonly, getBaseData);
router.post('/storeassets', adminlogin, adminonly, setAdminAssets);
router.get('/gettransactions', adminlogin, adminonly, fetchTransactions);
router.post('/transfer',  transferAsset);


module.exports = router ;