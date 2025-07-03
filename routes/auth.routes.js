const express = require("express");
const authController = require("../controllers/auth.controller.react");
const locationManager = require('../utils/location-manager');
const router = express.Router();

router.post("/loginReact", authController.loginReact);

router.post('/save-location-option', locationManager.saveLocationOption);

router.get("/usuarios", authController.getUsuarios);

module.exports = router;