require('dotenv').config();
const { Sequelize } = require('sequelize');

// Construimos el PEM como en el resto del proyecto
const pemFile = process.env.PEM_CERTIFICATE_DDBB.replace(/\\n/g, '\n');

// Configuración base compartida
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
  baseConfig.timezone = 'Europe/Madrid';
}

// Cache de conexiones
const connections = {};

function getSequelizeInstance(databaseSuffix) {
  const dbName = `hidrasmart_is_b${databaseSuffix}`;

  if (!connections[dbName]) {
    const sequelize = new Sequelize(
      dbName,
      process.env.AZURE_MYSQL_USER,
      process.env.AZURE_MYSQL_PASSWORD,
      baseConfig
    );

    connections[dbName] = sequelize;
  }

  return connections[dbName];
}


module.exports = { getSequelizeInstance };
