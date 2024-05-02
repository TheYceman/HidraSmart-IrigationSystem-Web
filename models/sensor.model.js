const { runQuery } = require("../data/bbdd-connector");

class Sensor {
  constructor(geSensor) {
    this.id = geSensor.ideEle;
    this.sector = geSensor.ideSector;
    this.radio = geSensor.ideRadio;
    this.tipo = geSensor.tipo;
    this.coorX = geSensor.coorX;
    this.coorY = geSensor.coorY;
  }

  static async getPerPage(perPage, offset) {

    const queryString = "SELECT * FROM ge_sensores LIMIT " + perPage + " OFFSET " + offset;
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geSensores = results.data.rows.map((sensor) => new Sensor(sensor));
    return geSensores;
  }
  static async getCountAll() {

    const queryString = "SELECT count(*) as total FROM ge_sensores;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllSensores() {

    const queryString = "SELECT * FROM ge_sensores;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geSensor = results.data.rows.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }
  static async getCaudalimetros() {

    const queryString = "SELECT * FROM ge_sensores WHERE tipo='caudalimetro';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geSensor = results.data.rows.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }

  static async getValvulas() {

    const queryString = "SELECT * FROM ge_sensores WHERE tipo='valvula';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geSensor = results.data.rows.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }

  static async getPresiones() {

    const queryString = "SELECT * FROM ge_sensores WHERE tipo='presion';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geSensor = results.data.rows.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }

  static async getNiveles() {

    const queryString = "SELECT * FROM ge_sensores WHERE tipo='nivel';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geSensor = results.data.rows.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }

  static async getFilteredData(tipo, idSensor, fechaInicio, fechaFin) {

    const queryString = `SELECT * FROM dat_${tipo} WHERE ideSensor="${idSensor}" AND instante > "${fechaInicio
      .slice(0, 19)
      .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`;
    const values = [];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM dat_${tipo} WHERE ideSensor="${idSensor}" AND instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
          .slice(0, 19)
          .replace("T", " ")}";`
    );
    return result.data.rows;;
  }
}

module.exports = Sensor;
