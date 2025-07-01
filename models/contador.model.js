// models/contador.model.js
const { DataTypes } = require('sequelize');

function Contador(sequelize) {
  return sequelize.define('ge_contadores', {
    ideEle: { type: DataTypes.STRING(10), primaryKey: true },
    ideTramo: { type: DataTypes.STRING(20) },
    ideRamal: { type: DataTypes.STRING(15) },
    ideTitular: { type: DataTypes.STRING(150) },
    ideCont: { type: DataTypes.STRING(45) },
    ideRadio: { type: DataTypes.INTEGER, defaultValue: 0 },
    volAsignado: { type: DataTypes.INTEGER },
    coorX: { type: DataTypes.DOUBLE },
    coorY: { type: DataTypes.DOUBLE },
    coorZ: { type: DataTypes.DOUBLE },
    calle_num: { type: DataTypes.STRING(45), defaultValue: "Calle" },
    cliente: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: 'ge_contadores',
    timestamps: false
  });
}

module.exports = { Contador };