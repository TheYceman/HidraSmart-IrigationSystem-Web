const express = require("express");
const navbarController = require("../controllers/navbar.controller");

const router = express.Router();

/********** Menú Inicio - Grupo 0 **********/
router.get("/", navbarController.getInicio);

router.get("/conocenos", navbarController.getConocenos);

router.get("/noticias", navbarController.getNoticias);

router.get("/junta-de-gobierno", navbarController.getJuntaGobierno);

router.get("/servicios", navbarController.getServicios);

router.get("/mapa", navbarController.getMapa);

router.get("/login", navbarController.getLogin);

/********** Menú Herramientas - Grupo 1 **********/
router.get(
  "/tramitacion-procedimientos",
  navbarController.getTramitacionProcedimientos
);

router.get("/mapa-sig", navbarController.getMapaSig);

router.get("/visor-datos", navbarController.getVisorDatos);
/********** Menú Gestores - Grupo 2 **********/
router.get("/gestor-noticias", navbarController.getGestorNoticias);

router.get("/gestor-equipos", navbarController.getGestorEquipos);

router.get("/gestor-riegos", navbarController.getGestorRiegos);

router.get("/gestor-red", navbarController.getGestorRed);

router.get("/gestor-usuarios", navbarController.getGestorUsuarios);

module.exports = router;
