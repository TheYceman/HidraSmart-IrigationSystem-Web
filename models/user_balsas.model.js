const { DataTypes } = require('sequelize');

function UserBalsaModel(sequelize) {
    return sequelize.define('UserBalsa', {
        user_id: DataTypes.INTEGER,
        balsa_id: DataTypes.INTEGER,
    }, {
        tableName: 'user_balsas',
        timestamps: false
    });
}

module.exports = { UserBalsaModel };
