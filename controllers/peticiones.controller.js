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
async function getAwPeticiones(databaseNumber) {
    if (!peticionesCache[databaseNumber]) {
        const sequelize = await getSequelizeInstance(databaseNumber);
        const AwPeticiones = Peticion(sequelize);
        peticionesCache[databaseNumber] = AwPeticiones;
    }
    return peticionesCache[databaseNumber];
}

/**
 * Obtiene el modelo TipoPeticion asociado a una base de datos concreta.
 * Usa caché para evitar volver a generar el modelo si ya existe.
 */
async function getAwTipoPeticiones(databaseNumber) {
    if (!tiposCache[databaseNumber]) {
        const sequelize = await getSequelizeInstance(databaseNumber);
        const AwTipoPeticiones = TipoPeticion(sequelize);
        tiposCache[databaseNumber] = AwTipoPeticiones;
    }
    return tiposCache[databaseNumber];
}

/**
 * Devuelve todas las peticiones almacenadas en una base de datos específica,
 * opcionalmente filtradas por fecha.
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

    return await AwPeticiones.findAll({
        where: whereClause,
        attributes: { exclude: ['image'] }
    });
}

/**
 * Devuelve los tipos de petición almacenados en una base de datos específica.
 */
async function getTiposPeticiones(databaseNumber) {
    const AwTipoPeticiones = await getAwTipoPeticiones(databaseNumber);
    return await AwTipoPeticiones.findAll();
}

/**
 * Actualiza una petición en la base de datos específica.
 * 
 * @param {number|string} databaseNumber - El número de la base de datos a utilizar.
 * @param {number|string} idPeticion - El ID de la petición a actualizar.
 * @param {Object} nuevosDatos - Un objeto que contiene los nuevos datos a aplicar a la petición.
 * @throws {Error} Si la petición no se encuentra.
 * @returns {Promise<Object>} La petición actualizada.
 */

async function updatePeticion(databaseNumber, idPeticion, nuevosDatos) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);

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
