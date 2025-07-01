const express = require("express");
const userConfigController = require("../controllers/user-configuration.controller");
const router = express.Router();

router.post("/checkPassword", userConfigController.checkPassword);

router.post("/changePassword", userConfigController.changePassword);

router.post("/getUserDataProv", userConfigController.getUserDataProv);

router.post("/sendVerificationCode", userConfigController.sendVerificationCode);

router.post("/checkCodeRequest", userConfigController.checkCodeRequest);

router.post("/switch2FA", userConfigController.switch2FA);


module.exports = router;