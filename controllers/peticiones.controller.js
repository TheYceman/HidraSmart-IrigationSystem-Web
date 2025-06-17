const { Op } = require('sequelize');
const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Peticion } = require('../models/peticion.model');

// Cache de modelos para evitar redefinirlos cada vez
const modelCache = {};

async function getAwPeticiones(databaseNumber) {
    if (!modelCache[databaseNumber]) {
        const sequelize = getSequelizeInstance(databaseNumber);
        const AwPeticiones = Peticion(sequelize);
        modelCache[databaseNumber] = AwPeticiones;
    }
    return modelCache[databaseNumber];
}

// Métodos del controlador (los de siempre)
async function getAll(databaseNumber) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);
    return await AwPeticiones.findAll();
}

async function getById(databaseNumber, idPeticion) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);
    return await AwPeticiones.findByPk(idPeticion);
}

async function getPerPage(databaseNumber, perPage, offset) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);
    return await AwPeticiones.findAll({
        limit: perPage,
        offset: offset
    });
}

async function getCountAll(databaseNumber) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);
    return await AwPeticiones.count();
}

async function getCountByStatus(databaseNumber, status) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);
    return await AwPeticiones.count({ where: { status } });
}

async function getCountAsignadasAMi(databaseNumber, userId) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);
    return await AwPeticiones.count({
        where: {
            assignedTo: userId,
            status: { [Op.ne]: 'Pendiente' }
        }
    });
}

module.exports = {
    getAll,
    getById,
    getPerPage,
    getCountAll,
    getCountByStatus,
    getCountAsignadasAMi
};
