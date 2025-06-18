const { Op } = require('sequelize');
const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Lectura } = require('../models/lectura.model');

const modelCache = {};

async function getAwLecturas(databaseNumber) {
    if (!modelCache[databaseNumber]) {
        const sequelize = await getSequelizeInstance(databaseNumber);
        const AwLecturas = Lectura(sequelize);
        modelCache[databaseNumber] = AwLecturas;
    }
    return modelCache[databaseNumber];
}

async function getAll(databaseNumber) {
    const AwLecturas = await getAwLecturas(databaseNumber);
    return await AwLecturas.findAll();
}

async function getByContador(databaseNumber, contador) {
    const AwLecturas = await getAwLecturas(databaseNumber);
    return await AwLecturas.findAll({
        where: { contador }
    });
}

module.exports = {
    getAll,
    getByContador
};
