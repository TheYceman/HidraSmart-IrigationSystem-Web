const express = require("express");
const estadoRedController = require("../controllers/estado-red.controller");

const router = express.Router();

/********** Menú Inicio - Grupo 0 **********/
router.get("/ge-data", estadoRedController.getGeData);

router.get("/data", estadoRedController.getData);

module.exports = router;
