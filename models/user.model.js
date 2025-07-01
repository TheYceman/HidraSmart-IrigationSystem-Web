const { DataTypes } = require('sequelize');
const { sequelizeHS_IS} = require('../data/bbdd-connector-sequelize');

const User = sequelizeHS_IS.define('user', {
    idusers: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'username',
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password',
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'name',
    },
    surname: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'surname',
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'email',
    },
    reset_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'reset_code',
      },
    reset_code_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'reset_code_expiration',
    },
    two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;
