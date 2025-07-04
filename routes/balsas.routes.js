const express = require('express');
const { getBalsasConEstadoPorUsuario } = require('../controllers/balsas.controller');
const router = express.Router();

// Ruta: obtener balsas con estado (permitido/denegado) para un usuario específico
router.get('/user/:userId/balsas-estado', getBalsasConEstadoPorUsuario);

module.exports = router;
