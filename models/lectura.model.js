const { DataTypes } = require('sequelize');
const { sequelizeHS_IS } = require('../data/bbdd-connector-sequelize');

const Lecturas = sequelizeHS_IS.define('aw_lecturas', {
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

class LecturasManager {
    static async getAll() {
        return await Lecturas.findAll();
    }
}

module.exports = Lecturas;
