const { DataTypes } = require('sequelize');
const { sequelizeHS_IS} = require('../data/bbdd-connector-sequelize');

const SessionLog = sequelizeHS_IS.define('session_log', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idusers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'idusers',
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_time',
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_time',
    },
    environment: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'environment',
    },
    device: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'device',
    },
    session_id: {
        type: DataTypes.STRING(128),
        allowNull: false,
        field: 'session_id',
    },
}, {
    tableName: 'session_logs',
    timestamps: false,
});

module.exports = SessionLog;
