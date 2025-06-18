const { Op } = require('sequelize');
const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Peticion } = require('../models/peticion.model');

const modelCache = {};

async function getAwPeticiones(databaseNumber) {
    if (!modelCache[databaseNumber]) {
        const sequelize = await getSequelizeInstance(databaseNumber);
        const AwPeticiones = Peticion(sequelize);
        modelCache[databaseNumber] = AwPeticiones;
    }
    return modelCache[databaseNumber];
}

async function getAll(databaseNumber) {
    const AwPeticiones = await getAwPeticiones(databaseNumber);
    return await AwPeticiones.findAll();
}

module.exports = {
    getAll
};
