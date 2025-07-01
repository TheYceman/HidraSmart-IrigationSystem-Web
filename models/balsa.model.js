const { DataTypes } = require('sequelize');

function BalsaModel(sequelize) {
    return sequelize.define('Balsa', {
        id_balsa: { type: DataTypes.INTEGER, primaryKey: true },
        num_balsa: DataTypes.TINYINT.UNSIGNED,
        network_id: DataTypes.INTEGER,
        bbdd: DataTypes.STRING,
        coordenadas: DataTypes.GEOMETRY('POINT'),
    }, {
        tableName: 'balsas',
        timestamps: false
    });
}

module.exports = { BalsaModel };
