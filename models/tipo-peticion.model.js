const { DataTypes } = require('sequelize');

function TipoPeticion(sequelize) {
    return sequelize.define('aw_tipo_peticiones', {
        idtipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        Descripcion: {
            type: DataTypes.STRING,
        }
    }, {
        tableName: 'aw_tipo_peticiones',
        timestamps: false
    });
}

module.exports = { TipoPeticion };
