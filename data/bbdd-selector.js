require('dotenv').config();
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

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
 * Genera el nombre de base de datos a partir del sufijo dinámico.
 * @param {string} suffix - Sufijo como "1", "2", "3", etc.
 * @returns {string} - Nombre de base de datos, p. ej. "hidrasmart_is_b1"
 */
function resolveDbName(suffix) {
  return `hidrasmart_is_b${suffix}`;
}

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
 * Devuelve una instancia de Sequelize para el sufijo de base de datos dado.
 */
async function getSequelizeInstance(databaseSuffix) {
  const dbName = resolveDbName(databaseSuffix);

  if (connections[dbName]) {
    return connections[dbName];
  }

  const sequelize = new Sequelize(
    dbName,
    process.env.AZURE_MYSQL_USER,
    process.env.AZURE_MYSQL_PASSWORD,
    baseConfig
  );

  await validateConnection(sequelize, dbName);

  connections[dbName] = sequelize;

  return sequelize;
}

/**
 * Escanea y devuelve los sufijos de bases de datos disponibles
 * que cumplen el patrón `hidrasmart_is_bX` (excluye `hidrasmart_is`)
 * @returns {Promise<string[]>} - Array de sufijos disponibles como ["1", "2", "3"]
 */
async function getAvailableBalsas() {
  const basePrefix = 'hidrasmart_is_b';
  const results = [];

  let i = 0;
  while (true) {
    const dbName = `${basePrefix}${i === 0 ? 'x' : i}`;
    try {
      const connection = await mysql.createConnection({
        host: process.env.AZURE_MYSQL_HOST,
        user: process.env.AZURE_MYSQL_USER,
        password: process.env.AZURE_MYSQL_PASSWORD,
        database: dbName,
        ssl: { ca: pemFile },
      });

      await connection.query('SELECT 1'); // Test conexión
      await connection.end();

      results.push(i === 0 ? 'x' : i.toString());
      i++; // Solo incrementar si tuvo éxito
    } catch (error) {
      console.warn(`❌ No disponible: ${dbName}`);
      break; // Sale del bucle si falla
    }
  }

  return results;
}

module.exports = {
  getSequelizeInstance,
  baseConfig,
  getAvailableBalsas,
};
