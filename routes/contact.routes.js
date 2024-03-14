const express = require("express");

const contactController = require("../controllers/contact.controller");

const router = express.Router();

router.post("/contact", contactController.enviaEmail);
//router.get("/formulario_enviado", contactController.enviaRespuesta);

module.exports = router;
