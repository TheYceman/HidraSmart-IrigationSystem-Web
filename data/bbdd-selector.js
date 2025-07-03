require('dotenv').config();
const { Sequelize } = require('sequelize');

const pemFile = process.env.PEM_CERTIFICATE_DDBB.replace(/\n/g, '\n');

const baseConfig = {
  host: process.env.AZURE_MYSQL_HOST,
  port: process.env.AZURE_MYSQL_PORT,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: pemFile,
    }
  },
  logging: false,
};

if (process.env.NODE_ENV === 'development') {
  baseConfig.timezone = '+02:00'; // Compatible con MySQL
}

const connections = {};

/**
 * Valida la conexión Sequelize para una base de datos específica.
 */
async function validateConnection(sequelize, dbName) {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error(`❌ Error al conectar con la base ${dbName}:`, error.message);
    throw new Error(`No se pudo conectar a la base de datos ${dbName}`);
  }
}

/**
 * Devuelve una instancia de Sequelize para un nombre de base de datos completo (ya formado).
 * @param {string} databaseName - Nombre de la base de datos completo, como "hidrasmart_is_b1"
 */
async function getSequelizeInstance(database) {
  if (connections[database]) {
    return connections[database];
  }

  const sequelize = new Sequelize(
    database,
    process.env.AZURE_MYSQL_USER,
    process.env.AZURE_MYSQL_PASSWORD,
    baseConfig
  );

  await validateConnection(sequelize, database);

  connections[database] = sequelize;

  return sequelize;
}

module.exports = {
  getSequelizeInstance,
  baseConfig,
};
