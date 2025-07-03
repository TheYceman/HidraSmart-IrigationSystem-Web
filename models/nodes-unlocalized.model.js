const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const NodesUnlocalized = sequelizeHS_IS.define('NodesUnlocalized', {
    serie: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    entidad: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'medidores_sin_localizar',
    timestamps: false,
});

module.exports = NodesUnlocalized;