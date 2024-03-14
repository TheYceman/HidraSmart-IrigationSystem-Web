const express = require("express");

const gestorEquiposController = require("../controllers/gestor-equipos.controller");

const router = express.Router();

router.get("/getContadoresMapa", gestorEquiposController.getGeDataContadorMapa);

router.get("/getContadoresTelemedida", gestorEquiposController.getGeDataContadorMapa);

router.get("/getContadoresTelemedidaMapa", gestorEquiposController.getGeDataContadorMapaTelemedida);

router.get("/getContadoresNoTelemedidaMapa", gestorEquiposController.getGeDataContadorMapaNoTelemedida);

module.exports = router;
