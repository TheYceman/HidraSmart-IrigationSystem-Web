const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');
const Permission = require('./permission.model');

const PermissionGroup = sequelizeHS_IS.define('permission_group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    per_equipos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    per_activos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    per_red: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    per_valvulas: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    per_simulador: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    per_estadistica: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'permission_groups',
    timestamps: false,
});

PermissionGroup.belongsTo(Permission, { foreignKey: 'per_equipos', as: 'equipos' });
PermissionGroup.belongsTo(Permission, { foreignKey: 'per_activos', as: 'activos' });
PermissionGroup.belongsTo(Permission, { foreignKey: 'per_red', as: 'red' });
PermissionGroup.belongsTo(Permission, { foreignKey: 'per_valvulas', as: 'valvulas' });
PermissionGroup.belongsTo(Permission, { foreignKey: 'per_simulador', as: 'simulador' });
PermissionGroup.belongsTo(Permission, { foreignKey: 'per_estadistica', as: 'estadistica' });

module.exports = PermissionGroup;
