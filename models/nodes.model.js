const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const Nodes = sequelizeHS_IS.define('Nodes', {
    contrato: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    entidad: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    refcat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    garcia_baq: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    industrial: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nod_equiv: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gemelo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    serie: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    geometrygood: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'nodos_equipos',
    timestamps: false,
});

module.exports = Nodes;