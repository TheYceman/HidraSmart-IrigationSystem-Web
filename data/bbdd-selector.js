require('dotenv').config();
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const { sequelizeHS_IS } = require('./bbdd-connector-sequelize');
const { BalsaModel } = require('../models/balsa.model');
const { UserBalsaModel } = require('../models/user_balsas.model');


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
async function getAvailableBalsas(user_id, network_id) {
  const UserBalsa = UserBalsaModel(sequelizeHS_IS);
  const Balsa = BalsaModel(sequelizeHS_IS);

  // 1. Obtener balsa_id del usuario
  const userBalsas = await UserBalsa.findAll({
    where: { user_id },
    attributes: ['balsa_id']
  });

  const balsaIds = userBalsas.map(entry => entry.balsa_id);
  if (!balsaIds.length) return [];

  // 2. Obtener nombres de base de datos (bbdd) según network_id y balsa_ids
  const balsas = await Balsa.findAll({
    where: {
      network_id,
      id_balsa: balsaIds
    },
    attributes: ['bbdd']
  });

  return balsas.map(b => b.bbdd); // ['hidrasmart_is_b1', ...]
}

module.exports = {
  getSequelizeInstance,
  baseConfig,
  getAvailableBalsas,
};
