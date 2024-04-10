const express = require("express");

const gestorUsuariosController = require("../controllers/gestor-usuarios.controller");
const gestorRolesController = require("../controllers/gestor-roles.controller");

const router = express.Router();

router.post("/actualizarUsuario", gestorUsuariosController.updateUsuario);

router.post("/borrarUsuario", gestorUsuariosController.deleteUsuario);

router.post("/agregarUsuario", gestorUsuariosController.agregaUsuario);

router.post("/actualizarRol", gestorRolesController.updateRol);

router.post("/borrarRol", gestorRolesController.deleteRol);

router.post("/agregarRol", gestorRolesController.agregaRol);


module.exports = router;
