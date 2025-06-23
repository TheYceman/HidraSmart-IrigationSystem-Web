const express = require('express');
const router = express.Router();

// Controladores 
const peticionesController = require('../controllers/peticiones.controller.js');
const lecturaController = require('../controllers/lecturas.controller.js');
const contadoresController = require('../controllers/contadores.controller.js');

// Selector de bases de datos
const { getAvailableBalsas } = require('../data/bbdd-selector.js');

// RUTA ESPECIAL - Obtener todas las bases de datos de balsas disponibles
router.get('/balsas-disponibles', async (req, res) => {
    try {
        const balsas = await getAvailableBalsas();
        res.json(balsas);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener balsas disponibles' });
    }
});

// Middleware para extraer el número de base de datos desde la ruta
router.param('databaseNumber', (req, res, next, value) => {
    req.databaseNumber = value;  // NO lo parseamos
    next();
});

// Obtener todas las peticiones
router.get('/is-b:databaseNumber/peticiones', async (req, res) => {
    try {
        const peticiones = await peticionesController.getAll(req.databaseNumber);
        res.json(peticiones);
    } catch (error) {
        console.error('Error al obtener las peticiones:', error);
        res.status(500).json({ error: 'Error al obtener las peticiones' });
    }
});

// Obtener todas las lecturas
router.get('/is-b:databaseNumber/lecturas', async (req, res) => {
    try {
        const lecturas = await lecturaController.getAll(req.databaseNumber);
        res.json(lecturas);
    } catch (error) {
        console.error('Error al obtener las lecturas:', error);
        res.status(500).json({ error: 'Error al obtener las lecturas' });
    }
});

// Obtener todas las lecturas de un contador
router.get('/is-b:databaseNumber/lecturas/cont-:contador', async (req, res) => {
    try {
        const databaseNumber = req.databaseNumber;
        const contador = req.params.contador;

        const lecturas = await lecturaController.getByContador(databaseNumber, contador);
        res.json(lecturas);
    } catch (error) {
        console.error('Error al obtener las lecturas:', error);
        res.status(500).json({ error: 'Error al obtener las lecturas' });
    }
});

// Obtener todos los contadores de una base de datos
router.get('/is-b:databaseNumber/contadores', async (req, res) => {
    try {
        const contadores = await contadoresController.getAll(req.databaseNumber);
        res.json(contadores);
    } catch (error) {
        console.error('Error al obtener contadores:', error);
        res.status(500).json({ error: 'Error al obtener contadores' });
    }
});

// Crear nueva lectura
router.get('/is-b:databaseNumber/lecturas', async (req, res) => {
    try {
        const lecturas = await lecturaController.getAll(req.databaseNumber);
        res.json(lecturas);
    } catch (error) {
        console.error('❌ Error al obtener las lecturas:', error);
        res.status(500).json({ error: 'Error al obtener las lecturas', details: error.message });
    }
});

module.exports = router;
