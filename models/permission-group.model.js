const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');
const PermissionLevels = require('./permission-levels.model');

const PermissionGroup = sequelizeHS_IS.define('permission_group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  per_cultivos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  per_cupos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  per_riegos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  per_meteo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  per_red: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  per_activos: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  per_cambios: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  per_usuarios: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'permission_groups',
  timestamps: false,
});

// Asociaciones con alias claros
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_cultivos', as: 'cultivos' });
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_cupos', as: 'cupos' });
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_riegos', as: 'riegos' });
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_meteo', as: 'meteo' });
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_red', as: 'red' });
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_activos', as: 'activos' });
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_cambios', as: 'cambios' });
PermissionGroup.belongsTo(PermissionLevels, { foreignKey: 'per_usuarios', as: 'usuarios' });

module.exports = PermissionGroup;
