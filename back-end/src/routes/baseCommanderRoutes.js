const express = require("express");
const router = express.Router();

const {loginBaseCommander, getBaseCommanderDashboard, getAssetsData, getBaseData, CommanderPurchase, fetchPurchaseData, fetchTransactions, transferAsset} = require("../controller/baseCommanderController");
const { baseCommanderLogin } = require("../middleware/authmiddleware");
const { baseCommanderOnly } = require("../middleware/rolemiddleware");

router.post("/login", loginBaseCommander);
router.get("/dashboard", baseCommanderLogin,baseCommanderOnly,getBaseCommanderDashboard);
router.get("/assetsdata", baseCommanderLogin, baseCommanderOnly, getAssetsData);
router.get("/basedata", baseCommanderLogin, baseCommanderOnly, getBaseData);
router.post("/purchase", baseCommanderLogin, baseCommanderOnly, CommanderPurchase);
router.get("/gettransactionsdata", baseCommanderLogin, baseCommanderOnly, fetchTransactions);
router.get("/getpurchasedata", baseCommanderLogin, baseCommanderOnly, fetchPurchaseData);
router.post("/transfer", baseCommanderLogin, baseCommanderOnly, transferAsset);
module.exports = router;
