const express = require("express");
const authController = require("../controllers/auth.controller.react");

const router = express.Router();

router.post("/loginReact", authController.loginReact);

router.get("/usuario/name-:id", authController.getNombreUsuarioById);

router.get("/usuarios", authController.getUsuarios);

module.exports = router;