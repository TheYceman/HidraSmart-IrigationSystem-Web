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
    const data = await runQuery("SELECT * FROM ge_valvulas;");
    const geValvulas = data.map((valvula) => new Valvula(valvula));
    return geValvulas;
  }

  static async getFilteredData(sector, fechaInicio, fechaFin) {
    const data = await runQuery(
      `SELECT * FROM dat_valvula WHERE ideSector=${sector} instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    return data;
  }
}

module.exports = Valvula;
