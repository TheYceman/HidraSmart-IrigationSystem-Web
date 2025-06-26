const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');
const Network = require('./network.model');
const PermissionGroup = require('./permission-group.model');

const UserPermission = sequelizeHS_IS.define('users_permissions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_users: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_network: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_permission_group: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'users_permissions',
    timestamps: false,
});

UserPermission.belongsTo(Network, { foreignKey: 'id_network' });
UserPermission.belongsTo(PermissionGroup, { foreignKey: 'id_permission_group' });

module.exports = UserPermission;
