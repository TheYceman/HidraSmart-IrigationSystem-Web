const { Op } = require('sequelize');
const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Peticion } = require('../models/peticion.model');

// Cache local de modelos para evitar redefinir el modelo múltiples veces por base de datos
const modelCache = {};

/**
 * Obtiene el modelo Peticion asociado a una base de datos concreta.
 * Usa caché para evitar volver a generar el modelo si ya existe.
 *
 * @param {string|number} databaseNumber - Identificador o número de la base de datos.
 * @returns {Promise<Model>} - Modelo Peticion asociado a esa base de datos.
 */
async function getAwPeticiones(databaseNumber) {
    // Si no se ha creado el modelo aún para esta base de datos, lo crea
    if (!modelCache[databaseNumber]) {
        const sequelize = await getSequelizeInstance(databaseNumber); // Obtiene la instancia Sequelize
        const AwPeticiones = Peticion(sequelize); // Crea el modelo Peticion con esa instancia
        modelCache[databaseNumber] = AwPeticiones; // Lo guarda en caché
    }
    return modelCache[databaseNumber]; // Devuelve el modelo ya cacheado
}

/**
 * Devuelve todas las peticiones almacenadas en una base de datos específica.
 *
 * @param {string|number} databaseNumber - Identificador de la base de datos.
 * @returns {Promise<Array>} - Array de objetos Peticion encontrados en la base de datos.
 */
async function getAll(databaseNumber, filtroFecha = null) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);

    const whereClause = filtroFecha
        ? {
            fecha: {
                [Op.gte]: new Date(`${filtroFecha}T00:00:00`),
                [Op.lt]: new Date(`${filtroFecha}T23:59:59`)
            }
        }
        : {};

    return await AwPeticiones.findAll({ where: whereClause });
}

// Exporta las funciones disponibles del módulo
module.exports = {
    getAll
};
