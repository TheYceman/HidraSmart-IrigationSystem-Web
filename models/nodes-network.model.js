const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const NodesNetwork = sequelizeHS_IS.define('NodesNetwork', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    info: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    refcat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cota: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gemelo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    industrial: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    demanda_me: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    geometrygood: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'nodos',
    timestamps: false,
});

module.exports = NodesNetwork;