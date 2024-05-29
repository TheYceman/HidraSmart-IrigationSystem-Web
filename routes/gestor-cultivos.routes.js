const express = require("express");

const gestorCultivosController = require("../controllers/gestor-cultivos.controller");

const router = express.Router();

router.post("/actualizarCultivo", gestorCultivosController.updateCultivo);

router.post("/borrarCultivo", gestorCultivosController.deleteCultivo);

router.post("/agregarCultivo", gestorCultivosController.getAgregaCultivo);

router.get('/getCultivos', gestorCultivosController.getDataCultivo);

module.exports = router;
