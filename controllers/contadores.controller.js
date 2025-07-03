const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Contador } = require('../models/contador.model');

const modelCache = {};

async function getAwContadores(database) {
    if (!modelCache[database]) {
        const sequelize = await getSequelizeInstance(database);
        const AwContadores = Contador(sequelize);
        modelCache[database] = AwContadores;
    }
    return modelCache[database];
}

async function getAll(database) {
    const AwContadores = await getAwContadores(database);
    return await AwContadores.findAll();
}

module.exports = {
    getAll
};
