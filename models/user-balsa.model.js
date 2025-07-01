const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');
const User = require('./user.model');
const Balsa = require('./balsa.model');

const UserBalsa = sequelizeHS_IS.define('user_balsa', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'idusers',
        },
        onDelete: 'CASCADE',
    },
    balsa_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Balsa,
            key: 'id_balsa',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'user_balsas',
    timestamps: false,
});

User.belongsToMany(Balsa, {
    through: UserBalsa,
    foreignKey: 'user_id',
    otherKey: 'balsa_id',
});

Balsa.belongsToMany(User, {
    through: UserBalsa,
    foreignKey: 'balsa_id',
    otherKey: 'user_id',
});

UserBalsa.belongsTo(Balsa, {
  foreignKey: 'balsa_id',
  as: 'balsa',
});


module.exports = UserBalsa;
