const express = require('express');
const router = express.Router();
const peticionesController = require('../controllers/peticiones.controller');

// Middleware para extraer el número de base de datos desde la ruta
router.param('databaseNumber', (req, res, next, value) => {
    req.databaseNumber = value;  // NO lo parseamos
    next();
});

// GET /is-bX/peticiones
router.get('/is-b:databaseNumber/peticiones', async (req, res) => {
    try {
        const peticiones = await peticionesController.getAll(req.databaseNumber);
        res.json(peticiones);
    } catch (error) {
        console.error('Error al obtener peticiones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /is-bX/peticiones/:idPeticion
router.get('/is-b:databaseNumber/peticiones/:idPeticion', async (req, res) => {
    try {
        const idPeticion = parseInt(req.params.idPeticion);
        if (isNaN(idPeticion)) {
            return res.status(400).json({ error: 'Parámetro idPeticion inválido' });
        }

        const peticion = await peticionesController.getById(req.databaseNumber, idPeticion);
        if (!peticion) {
            return res.status(404).json({ error: 'Petición no encontrada' });
        }

        res.json(peticion);
    } catch (error) {
        console.error('Error al obtener la petición:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
