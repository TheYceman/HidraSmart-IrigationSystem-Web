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
    const data = await runQuery("SELECT * FROM ge_sensores LIMIT " + perPage + " OFFSET " + offset + ";");
    const geSensores = data.map((sensor) => new Sensor(sensor));
    return geSensores;
  }
  static async getCountAll() {
    const data = await runQuery("SELECT count(*) as total FROM ge_sensores;");
    const geTotal = data.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllSensores() {
    const data = await runQuery("SELECT * FROM ge_sensores;");
    const geSensor = data.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }
  static async getCaudalimetros() {
    const data = await runQuery(
      "SELECT * FROM ge_sensores WHERE tipo='caudalimetro';"
    );
    const geSensor = data.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }

  static async getValvulas() {
    const data = await runQuery(
      "SELECT * FROM ge_sensores WHERE tipo='valvula';"
    );
    const geSensor = data.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }
  
  static async getPresiones() {
    const data = await runQuery(
      "SELECT * FROM ge_sensores WHERE tipo='presion';"
    );
    const geSensor = data.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }

  static async getNiveles() {
    const data = await runQuery(
      "SELECT * FROM ge_sensores WHERE tipo='nivel';"
    );
    const geSensor = data.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }

  static async getFilteredData(tipo, idSensor, fechaInicio, fechaFin) {
    const data = await runQuery(
      `SELECT * FROM dat_${tipo} WHERE ideSensor="${idSensor}" AND instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    console.log(
      `SELECT * FROM dat_${tipo} WHERE ideSensor="${idSensor}" AND instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    return data;
  }
}

module.exports = Sensor;
