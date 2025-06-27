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



// Obtener todas las peticiones de una balsa
router.get('/is-b:databaseNumber/peticiones', async (req, res) => {
    try {
        const fecha = req.query.fecha || null;
        const peticiones = await peticionesController.getAll(req.databaseNumber, fecha);
        res.json(peticiones);
    } catch (error) {
        console.error('Error al obtener las peticiones:', error);
        res.status(500).json({ error: 'Error al obtener las peticiones' });
    }
});

// Obtener las peticiones de todas las balsas
router.get('/peticiones-todas', async (req, res) => {
    try {
        const fecha = req.query.fecha || null;
        const balsas = await getAvailableBalsas();
        const results = [];

        for (const balsa of balsas) {
            const peticiones = await peticionesController.getAll(balsa, fecha);
            results.push(...peticiones);
        }

        res.json(results);
    } catch (error) {
        console.error('❌ Error al obtener todas las peticiones:', error);
        res.status(500).json({ error: 'Error al obtener todas las peticiones' });
    }
});

router.get('/is-b:databaseNumber/peticion/nombre/:id', async (req, res) => {
    try {
        const databaseNumber = req.params.databaseNumber;
        const idtipo = req.params.id;

        if (databaseNumber === "all") {
            const balsas = await getAvailableBalsas();

            for (const balsa of balsas) {
                const nombre = await peticionesController.getNombreTipo(balsa, idtipo);
                if (nombre) return res.send(nombre);
            }

            return res.status(404).send("Tipo no encontrado");
        }

        const peticion = await peticionesController.getNombreTipo(databaseNumber, idtipo);
        res.send(peticion ?? "Tipo no encontrado");
    } catch (error) {
        console.error('❌ Error al obtener la petición:', error);
        res.status(500).json({ error: 'Error al obtener la petición' });
    }
});

// Actualizar petición
router.put('/is-b:databaseNumber/peticiones/:id', async (req, res) => {
    try {
        const databaseNumber = req.params.databaseNumber;
        const id = req.params.id;
        const datos = req.body;

        console.log("ID de la petición:", id);
        console.log("Datos recibidos:", datos);

        const resultado = await peticionesController.updatePeticion(databaseNumber, id, datos);

        res.json({ success: true, resultado });
    } catch (error) {
        console.error("Error al actualizar la petición:", error);
        res.status(500).json({ error: "Error al actualizar la petición" });
    }
});



// Obtener todas las lecturas
router.get('/is-b:databaseNumber/lecturas', async (req, res) => {
    try {
        const fecha = req.query.fecha || null;
        const lecturas = await lecturaController.getAll(req.databaseNumber, fecha);
        res.json(lecturas);
    } catch (error) {
        console.error('Error al obtener las lecturas:', error);
        res.status(500).json({ error: 'Error al obtener las lecturas' });
    }
});

// Obtener las lecturas de todas las balsas
router.get('/lecturas-todas', async (req, res) => {
    try {
        const fecha = req.query.fecha || null;
        const balsas = await getAvailableBalsas();
        const results = [];

        for (const balsa of balsas) {
            const lecturas = await lecturaController.getAll(balsa, fecha);
            results.push(...lecturas);
        }

        res.json(results);
    } catch (error) {
        console.error('❌ Error al obtener todas las lecturas:', error);
        res.status(500).json({ error: 'Error al obtener todas las lecturas' });
    }
});



// Obtener todas las lecturas de un contador de una balsa
router.get('/is-b:databaseNumber/lecturas/cont-:contador', async (req, res) => {
    try {
        const { databaseNumber } = req;
        const { contador } = req.params;
        const fecha = req.query.fecha || null;

        const lecturas = await lecturaController.getByContador(databaseNumber, contador, fecha);
        res.json(lecturas);
    } catch (error) {
        console.error('Error al obtener las lecturas por contador:', error);
        res.status(500).json({ error: 'Error al obtener lecturas por contador' });
    }
});

// Obtener todas las lecturas de un contador de todas las balsas
router.get('/lecturas-todas/cont-:contador', async (req, res) => {
    try {
        const contador = req.params.contador;
        const fecha = req.query.fecha || null;
        const balsas = await getAvailableBalsas();
        const results = [];

        for (const balsa of balsas) {
            const lecturas = await lecturaController.getByContador(balsa, contador, fecha);
            results.push(...lecturas);
        }

        res.json(results);
    } catch (error) {
        console.error('❌ Error al obtener lecturas por contador:', error);
        res.status(500).json({ error: 'Error al obtener lecturas por contador' });
    }
});

// Actualizar lectura
router.put('/is-b:databaseNumber/lecturas/:id', async (req, res) => {
    try {
        const databaseNumber = req.params.databaseNumber;
        const id = req.params.id;
        const datos = req.body;

        console.log("ID de la lectura a actualizar:", id);
        console.log("Datos recibidos:", datos);

        const resultado = await lecturaController.updateLectura(databaseNumber, id, datos);
        res.json({ success: true, resultado });
    } catch (error) {
        console.error("❌ Error al actualizar la lectura:", error);
        res.status(500).json({ error: "Error al actualizar la lectura" });
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

// Obtener todos los contadores de todas las balsas
router.get('/contadores-todos', async (req, res) => {
    try {
        const balsas = await getAvailableBalsas();
        const results = [];

        for (const balsa of balsas) {
            const contadores = await contadoresController.getAll(balsa);
            results.push(...contadores);
        }

        res.json(results);
    } catch (error) {
        console.error('❌ Error al obtener todos los contadores:', error);
        res.status(500).json({ error: 'Error al obtener todos los contadores' });
    }
});


// Crear nueva lectura
router.post('/is-b:databaseNumber/lecturas', async (req, res) => {
    try {
        const databaseNumber = req.databaseNumber;
        const data = req.body;

        const nuevaLectura = await lecturaController.createLectura(databaseNumber, data);
        res.status(201).json({ message: "Lectura creada correctamente", lectura: nuevaLectura });
    } catch (error) {
        console.error('❌ Error al crear lectura:', error);
        res.status(500).json({ error: 'Error al crear lectura', details: error.message });
    }
});

module.exports = router;
