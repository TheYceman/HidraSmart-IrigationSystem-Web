// database/bbdd-connector-sequelize.js

/* sección [Conector Sequelize] Conector sequelize */
// File: /data/bbdd-connector-sequelize.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const pemFile = process.env.PEM_CERTIFICATE_DDBB.replace(/\\n/g, '\n');

const baseConfig = {
  host: process.env.AZURE_MYSQL_HOST,
  port: process.env.AZURE_MYSQL_PORT,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: pemFile,
    },
  },
  logging: false,
};

if (process.env.NODE_ENV === 'development') {
  baseConfig.timezone = 'Europe/Madrid';
}

// Function to create a Sequelize instance for a given database
function createSequelizeInstance(databaseName) {
  return new Sequelize(
    databaseName,
    process.env.AZURE_MYSQL_USER,
    process.env.AZURE_MYSQL_PASSWORD,
    baseConfig
  );
}

// Cache for Sequelize instances to avoid creating multiple connections for the same database
const sequelizeCache = {};

// Function to get or create a Sequelize instance
async function getSequelizeInstance(databaseName) {
  if (!sequelizeCache[databaseName]) {
    const sequelize = createSequelizeInstance(databaseName);
    try {
      await sequelize.authenticate();
      console.log(`Conexión a ${databaseName} establecida con éxito.`);
      sequelizeCache[databaseName] = sequelize;
    } catch (error) {
      console.error(`Error de conexión a ${databaseName}:`, error);
      throw error;
    }
  }
  return sequelizeCache[databaseName];
}

// Default connection for hidrasmart_is (optional, for backward compatibility)
const sequelizeHS_IS = createSequelizeInstance(process.env.AZURE_MYSQL_DATABASE_HS_IS);

(async () => {
  try {
    await sequelizeHS_IS.authenticate();
    console.log('Conexión a hidrasmart_is establecida con éxito.');
  } catch (error) {
    console.error('Error de conexión a hidrasmart_is:', error);
  }
})();

module.exports = {
  sequelizeHS_IS, // Keep for backward compatibility
  getSequelizeInstance,
  baseConfig,
};

/* [Fin de sección] */