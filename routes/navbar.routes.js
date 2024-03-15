const express = require("express");

const navbarController = require("../controllers/navbar.controller");

const router = express.Router();

var Auth = require('../controllers/auth.service');

/********** Menú Inicio - Grupo 0 **********/

router.get("/", Auth.requireLogin, function (req, res, html) {
    console.log(req.session);
    navbarController.getDashboard(req, res);
});

router.get("/soporte", navbarController.getSoporte);

router.get("/formulario_enviado", navbarController.getRespuestaContacto);

router.get('/logout', (req, res) => {
    // Destruye la sesión actual
    navbarController.getLogout(req, res);
});

// Middleware para verificar certificados de cliente
const verificarCertificado = (req, res, next) => {

    //Verifica el certificado

    const clientCert = req.connection.getPeerCertificate();
    //console.log(util.inspect(clientCert, false, null, true /* enable colors */));

    if (clientCert && clientCert.subject) {
    // Verifica el certificado del cliente aquí
        console.log("Verifica el certificado del cliente aquí");
    } else {
    // La autenticación falló
        console.log("La autenticación falló " + clientCert);
    }

    //Fin verifica el certificado

    // Verifica si se proporcionó un certificado de cliente y si está autorizado
    if (req.url === '/visor-datos' && req.client.authorized) {
      console.log('Certificado de cliente válido.');
      next(); // Continúa con la solicitud
    } else {
      console.log('Certificado de cliente no válido.');
      res.status(403).send('Acceso prohibido'); // Responde con un error 403 Forbidden
    }
  };

router.get('/panel_aplicaciones', Auth.requireLogin, function (req, res, html) {
    console.log(req.session);
    navbarController.getDashboard(req, res);
});

/********** Menú Herramientas - Grupo 1 **********/

router.get('/mapa-sig', Auth.requireLogin, function (req, res, html) {
    console.log(req.session);
    navbarController.getMapaSig(req, res);
});

router.get('/visor-datos', Auth.requireLogin, function (req, res, html) {
    console.log(req.session);
    navbarController.getVisorDatos(req, res);
});

/********** Menú Gestores - Grupo 2 **********/

router.get('/gestor-equipos', Auth.requireLogin, function (req, res, html) {
    console.log(req.session);
    navbarController.getGestorEquipos(req, res);
});

router.get('/gestor-clientes', Auth.requireLogin, function (req, res, html) {
    console.log(req.session);
    navbarController.getGestorClientes(req, res);
});

router.get('/gestor-usuarios', Auth.requireLogin, function (req, res, html) {
    console.log(req.session);
    navbarController.getGestorUsuarios(req, res);
});

module.exports = router;
