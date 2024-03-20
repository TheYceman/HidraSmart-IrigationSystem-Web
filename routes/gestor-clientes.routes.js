const express = require("express");

const gestorClientesController = require("../controllers/gestor-clientes.controller");

const router = express.Router();

router.post("/actualizarCliente", gestorClientesController.updateCliente);

router.post("/borrarCliente", gestorClientesController.deleteCliente);

router.post("/agregarCliente", gestorClientesController.agregaCliente);

module.exports = router;
