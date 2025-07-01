const { Op } = require('sequelize');
const PermissionLevels = require('../models/permission-levels.model');

async function getAllPermissionLevels(req, res) {
    try {
        const levels = await PermissionLevels.findAll({ attributes: ['id', 'level'] });
        res.json(levels);
    } catch (error) {
        console.error('Error al obtener niveles de permiso:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = { getAllPermissionLevels };
