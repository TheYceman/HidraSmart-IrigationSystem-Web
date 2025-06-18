const { DataTypes } = require('sequelize');

function Lectura(sequelize) {
    return sequelize.define('aw_lecturas', {
        idLectura: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        contador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        usuario: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        volumen: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'aw_lecturas',
        timestamps: false
    });
}

module.exports = { Lectura };
