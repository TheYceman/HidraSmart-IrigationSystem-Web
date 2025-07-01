const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');
const UserPermission = require('./user-permission.model');

const User = sequelizeHS_IS.define('user', {
    idusers: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
    },
    reset_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    reset_code_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // rol: {
    //     type: DataTypes.STRING(10),
    //     allowNull: true,
    // },
}, {
    tableName: 'users',
    timestamps: false,
});
User.hasMany(UserPermission, { foreignKey: 'id_users' });
UserPermission.belongsTo(User, { foreignKey: 'id_users' });
module.exports = User;
