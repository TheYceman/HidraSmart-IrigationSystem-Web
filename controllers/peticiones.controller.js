const { Op } = require('sequelize');
const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Peticion } = require('../models/peticion.model');
const { TipoPeticion } = require('../models/tipo-peticion.model');

// Cache local de modelos para evitar redefinir el modelo múltiples veces por base de datos
const peticionesCache = {};
const tiposCache = {};

/**
 * Obtiene el modelo Peticion asociado a una base de datos concreta.
 * Usa caché para evitar volver a generar el modelo si ya existe.
 */
async function getAwPeticiones(database) {
    if (!peticionesCache[database]) {
        const sequelize = await getSequelizeInstance(database);
        const AwPeticiones = Peticion(sequelize);
        peticionesCache[database] = AwPeticiones;
    }
    return peticionesCache[database];
}

/**
 * Obtiene el modelo TipoPeticion asociado a una base de datos concreta.
 * Usa caché para evitar volver a generar el modelo si ya existe.
 */
async function getAwTipoPeticiones(database) {
    if (!tiposCache[database]) {
        const sequelize = await getSequelizeInstance(database);
        const AwTipoPeticiones = TipoPeticion(sequelize);
        tiposCache[database] = AwTipoPeticiones;
    }
    return tiposCache[database];
}

/**
 * Devuelve todas las peticiones almacenadas en una base de datos específica,
 * opcionalmente filtradas por fecha.
 */
async function getAll(database, filtroFecha = null) {
    const AwPeticiones = await getAwPeticiones(database);

    const whereClause = filtroFecha
        ? {
            fecha: {
                [Op.gte]: new Date(`${filtroFecha}T00:00:00`),
                [Op.lt]: new Date(`${filtroFecha}T23:59:59`)
            }
        }
        : {};

    return await AwPeticiones.findAll({
        where: whereClause,
        attributes: { exclude: ['image'] }
    });
}

/**
 * Devuelve los tipos de petición almacenados en una base de datos específica.
 */
async function getTiposPeticiones(database) {
    const AwTipoPeticiones = await getAwTipoPeticiones(database);
    return await AwTipoPeticiones.findAll();
}

/**
 * Actualiza una petición en la base de datos específica.
 * 
 * @param {number|string} database - El número de la base de datos a utilizar.
 * @param {number|string} idPeticion - El ID de la petición a actualizar.
 * @param {Object} nuevosDatos - Un objeto que contiene los nuevos datos a aplicar a la petición.
 * @throws {Error} Si la petición no se encuentra.
 * @returns {Promise<Object>} La petición actualizada.
 */

async function updatePeticion(database, idPeticion, nuevosDatos) {
    const AwPeticiones = await getAwPeticiones(database);

    const peticion = await AwPeticiones.findByPk(idPeticion);
    if (!peticion) throw new Error("Petición no encontrada");

    await peticion.update(nuevosDatos);
    return peticion;
}

module.exports = {
    getAll,
    getTiposPeticiones,
    updatePeticion,
};
