const { runQuery } = require("../data/bbdd-connector");

class Caudalimetro extends Sensor {
  constructor(caudalimetro) {
    super(caudalimetro);
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
