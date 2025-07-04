const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');
const Network = require('./network.model'); // ✅ Importar Network

const Balsa = sequelizeHS_IS.define('balsa', {
  id_balsa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  num_balsa: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
  },
  network_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bbdd: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  coordenadas: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: true,
  },
}, {
  tableName: 'balsas',
  timestamps: false,
  indexes: [
    {
      unique: true,
      name: 'uk_balsa_local',
      fields: ['network_id', 'num_balsa']
    }
  ]
});


Balsa.belongsTo(Network, {
  foreignKey: 'network_id',
  as: 'network'
});

module.exports = Balsa;
