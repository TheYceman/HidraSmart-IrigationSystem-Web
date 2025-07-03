/* sección [Conseguir válvulas] Modelo válvula */

// File: /models/valve.model.js
const { DataTypes } = require('sequelize');

function defineValveModel(sequelize) {
  return sequelize.define(
    'Valve',
    {
      ideSensor: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      ideRadio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dimension: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      coorX: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      coorY: {
        type: DataTypes.FLOAT,
        allowNull: true,
      }
    },
    
    {
      tableName: 'ge_valvulas',
      timestamps: false,
    }
  );
}

module.exports = defineValveModel;

/* [Fin de sección] */