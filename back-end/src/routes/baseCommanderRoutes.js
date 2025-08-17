const express = require("express");
const router = express.Router();

const {loginBaseCommander, getBaseCommanderDashboard} = require("../controller/baseCommanderController");
const { baseCommanderLogin } = require("../middleware/authmiddleware");
const { baseCommanderOnly } = require("../middleware/rolemiddleware");

router.post("/login", loginBaseCommander);
router.get("/dashboard", baseCommanderLogin,baseCommanderOnly,getBaseCommanderDashboard);

module.exports = router;
