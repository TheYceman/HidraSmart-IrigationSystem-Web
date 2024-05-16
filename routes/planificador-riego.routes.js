const express = require("express");
const planificadorRiegoController = require("../controllers/planificador-riego.controller");

const router = express.Router();

/********** Menú Inicio - Grupo 0 **********/
router.get("/ge-data", planificadorRiegoController.getGeData);

router.get("/data", planificadorRiegoController.getGeDataRiego);

module.exports = router;
