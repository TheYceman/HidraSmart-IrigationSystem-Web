const express = require("express");

const gestorUsuariosController = require("../controllers/gestor-usuarios.controller");

const router = express.Router();

router.post("/actualizarUsuario", gestorUsuariosController.updateUsuario);

router.post("/borrarUsuario", gestorUsuariosController.deleteUsuario);

router.post("/agregarUsuario", gestorUsuariosController.agregaUsuario);

module.exports = router;
