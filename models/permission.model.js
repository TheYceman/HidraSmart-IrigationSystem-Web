const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const Permission = sequelizeHS_IS.define('permission', {
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
    },
    notes: {
        type: DataTypes.TEXT, // Permite descripciones largas
        allowNull: true,
    },
}, {
    tableName: 'permissions',
    timestamps: false,
});

module.exports = Permission;
