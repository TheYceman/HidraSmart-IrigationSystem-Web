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

  static async getAll() {
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
