const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const DemandPlots = sequelizeHS_IS.define('DemandPlots', {
    mapa: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    delegacio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    municipio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    masa: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    hoja: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    parcela: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    coorx: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    coory: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    via: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numerodup: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numsymbol: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    area: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    fechaalta: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    fechabaja: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ninterno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pcat1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pcat2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ejercicio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    num_exp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    control: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    refcat: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gemelo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    geometrygood: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'parcelas_demanda',
    timestamps: false,
});

module.exports = DemandPlots;