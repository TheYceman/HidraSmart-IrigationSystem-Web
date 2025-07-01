const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const PermissionLevels= sequelizeHS_IS.define('permission_levels', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    level: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'permission_levels',
    timestamps: false,
});

module.exports =  PermissionLevels 