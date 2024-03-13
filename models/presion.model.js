const { runQuery } = require("../data/bbdd-connector");

class Presion {
  constructor(presion) {
    this.id = presion.ideSensor;
    this.sector = presion.ideSector;
    this.radio = presion.ideRadio;
    this.tipo = presion.tipo;
    this.parametro = presion.parametro;
    this.coorX = presion.coorX;
    this.coorY = presion.coorY;
    this.comment = presion.comment;
    this.estados = presion.estados;
    this.displayId = `Sec${this.sector}_pre_${this.id}`;
    this.tipoElemento = "presion";
  }

  static async getAll() {
    const data = await runQuery("SELECT * FROM ge_presiones;");
    const gePresiones = data.map((presion) => new Presion(presion));
    return gePresiones;
  }

  static async getFilteredData(sector, fechaInicio, fechaFin) {
    const data = await runQuery(
      `SELECT * FROM dat_presion WHERE ideSector=${sector} instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    return data;
  }
}

module.exports = Presion;
