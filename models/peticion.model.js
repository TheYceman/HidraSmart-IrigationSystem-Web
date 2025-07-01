const { DataTypes } = require('sequelize');

function Peticion(sequelize) {
    return sequelize.define('aw_peticiones', {
        idPeticion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(45), allowNull: false },
        image: { type: DataTypes.STRING(200), allowNull: true },
        requester: { type: DataTypes.INTEGER, allowNull: true },
        assignedTo: { type: DataTypes.INTEGER, allowNull: true },
        priority: { type: DataTypes.STRING(45), allowNull: true },
        status: { type: DataTypes.STRING(45), allowNull: true },
        type: { type: DataTypes.INTEGER, allowNull: true },
        comments: { type: DataTypes.STRING(255), allowNull: true },
        fecha: { type: DataTypes.DATE, allowNull: true },
        contador: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        tableName: 'aw_peticiones',
        timestamps: false
    });
}

module.exports = { Peticion };
