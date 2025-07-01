const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const Network = sequelizeHS_IS.define('network', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name_network: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name_network',
    },
    
    logo: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.STRING
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 6)
    },
    longitude: {
        type: DataTypes.DECIMAL(10, 6)
    },
    zoom: {
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'networks',
    timestamps: false,
});

module.exports = Network;
