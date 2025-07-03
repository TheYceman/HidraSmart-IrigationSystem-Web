const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const Valve = sequelizeHS_IS.define('Valve', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    ninicio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nfinal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    diametro: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    info: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tele: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    geometrygood: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'valvulas',
    timestamps: false,
});

module.exports = Valve;