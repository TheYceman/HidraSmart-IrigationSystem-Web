const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Contador } = require('../models/contador.model');

const modelCache = {};

async function getAwContadores(databaseNumber) {
    if (!modelCache[databaseNumber]) {
        const sequelize = await getSequelizeInstance(databaseNumber);
        const AwContadores = Contador(sequelize);
        modelCache[databaseNumber] = AwContadores;
    }
    return modelCache[databaseNumber];
}

async function getAll(databaseNumber) {
    const AwContadores = await getAwContadores(databaseNumber);
    return await AwContadores.findAll();
}

module.exports = {
    getAll
};
