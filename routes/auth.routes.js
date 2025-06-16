const express = require("express");
const authController = require("../controllers/auth.controller.react");

const router = express.Router();

router.post("/loginReact", authController.loginReact);

router.post("/changePasswordReact", authController.changePassword);

module.exports = router;