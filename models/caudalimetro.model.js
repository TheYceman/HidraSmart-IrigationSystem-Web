const { runQuery } = require("../data/bbdd-connector");
const Sensor = require("./sensor.model");

class Caudalimetro extends Sensor {
  constructor(caudalimetro) {
    super(caudalimetro);
  }
  static async getCaudalimetrosTelemedida() {
    const data1 = await runQuery("SELECT ge_sensores.ideEle, dat_caudalimetro.volAcum,dat_presion.presion, dat_caudalimetro.bateria, dat_caudalimetro.RSSI, dat_caudalimetro.instante, ge_sensores.coorX, ge_sensores.coorY FROM aplicaciones_web.ge_sensores, dat_presion, dat_caudalimetro WHERE ge_sensores.ideEle=dat_presion.ideSensor and  ge_sensores.ideEle=dat_caudalimetro.ideSensor ORDER BY instante DESC LIMIT 1;");
    const data = await runQuery("SELECT ge_sensores.ideEle, dat_caudalimetro.volAcum,dat_caudalimetro.bateria, dat_caudalimetro.RSSI, dat_caudalimetro.instante, ge_sensores.coorX, ge_sensores.coorY FROM aplicaciones_web.ge_sensores, dat_caudalimetro WHERE ge_sensores.ideEle=dat_caudalimetro.ideSensor ORDER BY instante DESC LIMIT 1;");
    const geSensor = data.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }
  
  static async getFilteredData(sensor, fechaInicio, fechaFin) {
    const data = await runQuery(
      `SELECT * FROM dat_caudalimetros WHERE ideSensor="${sensor}" AND instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    console.log(
      `SELECT * FROM dat_caudalimetros WHERE ideSensor="${sensor}" AND instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    return data;
  }
}

module.exports = Caudalimetro;
