const express = require("express");

const gestorEquiposController = require("../controllers/gestor-equipos.controller");

const router = express.Router();

router.post("/actualizarContador", gestorEquiposController.updateContador);

router.post("/borrarContador", gestorEquiposController.deleteContador);

router.post("/agregarContador", gestorEquiposController.getAgregaEquipo);
// Ruta para mostrar la tabla de datos
router.get('/historico', gestorEquiposController.mostrarHistorico);

module.exports = router;
