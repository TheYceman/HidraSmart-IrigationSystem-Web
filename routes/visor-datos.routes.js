const express = require("express");
const visorDatosController = require("../controllers/visor-datos.controller");

const router = express.Router();

/********** Menú Inicio - Grupo 0 **********/
router.get("/ge-data", visorDatosController.getGeData);

router.get("/data", visorDatosController.getData);

module.exports = router;
