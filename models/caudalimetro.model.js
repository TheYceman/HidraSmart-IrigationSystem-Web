const { runQuery } = require("../data/bbdd-connector");
const Sensor = require("./sensor.model");

class Caudalimetro extends Sensor {
  constructor(caudalimetro) {
    super(caudalimetro);
  }
  static async getCaudalimetrosTelemedida() {
    
    const queryString ="SELECT ge_sensores.ideEle, dat_caudalimetro.volAcum,dat_caudalimetro.bateria, dat_caudalimetro.RSSI, dat_caudalimetro.instante, ge_sensores.coorX, ge_sensores.coorY FROM aplicaciones_web.ge_sensores, dat_caudalimetro WHERE ge_sensores.ideEle=dat_caudalimetro.ideSensor ORDER BY instante DESC LIMIT 1;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geSensor = results.data.rows.map((geSensor) => new Sensor(geSensor));
    return geSensor;
  }
  
  static async getFilteredData(sensor, fechaInicio, fechaFin) {
    const queryString = `SELECT * FROM dat_caudalimetros WHERE ideSensor="${sensor}" AND instante > "${fechaInicio
      .slice(0, 19)
      .replace("T", " ")}" AND instante < "${fechaFin
      .slice(0, 19)
      .replace("T", " ")}";`;
    const values = [];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM dat_caudalimetros WHERE ideSensor="${sensor}" AND instante > "${fechaInicio
        .slice(0, 19)
        .replace("T", " ")}" AND instante < "${fechaFin
        .slice(0, 19)
        .replace("T", " ")}";`
    );
    return result.data.rows;;
  }
}

module.exports = Caudalimetro;
