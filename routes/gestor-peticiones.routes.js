const express = require("express");

const gestorPeticionesController = require("../controllers/gestor-peticiones.controller");

const router = express.Router();

router.post("/actualizarPeticion", gestorPeticionesController.updatePeticion);

router.post("/borrarPeticion", gestorPeticionesController.deletePeticion);

router.post("/agregarPeticion", gestorPeticionesController.agregaPeticion);

module.exports = router;
