const { runQuery } = require("../data/bbdd-connector");

class Valvula {
  constructor(valvula) {
    this.id = valvula.ideSensor;
    this.sector = valvula.ideSector;
    this.radio = valvula.ideRadio;
    this.tipo = valvula.tipo;
    this.parametro = valvula.parametro;
    this.coorX = valvula.coorX;
    this.coorY = valvula.coorY;
    this.comment = valvula.comment;
    this.estados = valvula.estados;
    this.displayId = `Sec${this.sector}_val_${this.id}`;
    this.tipoElemento = "valvula";
  }

  static async getAll() {

    const queryString = "SELECT * FROM ge_valvulas;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geValvulas = results.data.rows.map((valvula) => new Valvula(valvula));
    return geValvulas;
  }

  static async getFilteredData(sector, fechaInicio, fechaFin) {

    const queryString = `SELECT * FROM dat_valvulas WHERE ideSector=${sector} instante > "${fechaInicio
      .slice(0, 19)
      .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`;
    const values = [];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Valvula;
