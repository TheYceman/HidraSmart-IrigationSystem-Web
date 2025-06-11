// database/bbdd-connector-sequelize.js
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
    }
  },
  logging: false,
};

if (process.env.NODE_ENV === 'development') {
  baseConfig.timezone = 'Europe/Madrid';
}

const sequelizeHS_IS = new Sequelize(
  process.env.AZURE_MYSQL_DATABASE_HS_IS, 
  process.env.AZURE_MYSQL_USER,
  process.env.AZURE_MYSQL_PASSWORD,
  baseConfig
);

(async () => {
  try {
    await sequelizeHS_IS.authenticate();
    console.log('Conexión a hidrasmart_is establecida con éxito.');
  } catch (error) {
    console.error('Error de conexión a hidrasmart_is:', error);
  }
})();

module.exports = {
  sequelizeHS_IS,
  baseConfig,
};
