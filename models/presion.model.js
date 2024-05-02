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

    const queryString = "SELECT * FROM ge_presiones;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const gePresiones = results.data.rows.map((presion) => new Presion(presion));
    return gePresiones;
  }


  static async getPresionesTelemedida() {
    const queryString = "SELECT ge_sensores.ideEle, dat_presion.presion, dat_presion.bateria, dat_presion.RSSI, dat_presion.instante, ge_sensores.coorX, ge_sensores.coorY FROM aplicaciones_web.ge_sensores, dat_presion WHERE ge_sensores.ideEle=dat_presion.ideSensor  ORDER BY instante DESC LIMIT 1 ;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const gePresion = results.data.rows.map((gePresion) => new Presion(gePresion));
    return gePresion;
  }


  static async getFilteredData(sector, fechaInicio, fechaFin) {
    const queryString = `SELECT * FROM dat_presion WHERE ideSector="${sector}" AND instante > "${fechaInicio
      .slice(0, 19)
      .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    const values = [];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Presion;
