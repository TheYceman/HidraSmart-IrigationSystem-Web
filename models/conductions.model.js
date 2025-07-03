const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const Conductions = sequelizeHS_IS.define('Conductions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    material: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ninicio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nfinal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    info: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    longitud: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    diametro: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    geometrygood: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'conducciones',
    timestamps: false,
});

module.exports = Conductions;