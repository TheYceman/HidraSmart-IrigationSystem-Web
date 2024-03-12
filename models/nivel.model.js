const { runQuery } = require("../data/bbdd-connector");

class Nivel {
  constructor(nivel) {
    this.id = nivel.ideSensor;
    this.sector = nivel.ideSector;
    this.radio = nivel.ideRadio;
    this.tipo = nivel.tipo;
    this.parametro = nivel.parametro;
    this.coorX = nivel.coorX;
    this.coorY = nivel.coorY;
    this.comment = nivel.comment;
    this.estados = nivel.estados;
    this.displayId = `Sec${this.sector}_niv_${this.id}`;
    this.tipoElemento = "nivel";
  }

  static async getAll() {
    const data = await runQuery("SELECT * FROM ge_niveles;");
    const geNiveles = data.map((nivel) => new Nivel(nivel));
    return geNiveles;
  }

  static async getFilteredData(sector, fechaInicio, fechaFin) {
    const data = await runQuery(
      `SELECT * FROM dat_nivel WHERE ideSector=${sector} instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    return data;
  }
}

module.exports = Nivel;
