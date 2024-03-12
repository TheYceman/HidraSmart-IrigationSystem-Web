const Sensor = require("../models/sensor.model");

async function getGeData(req, res) {
  const geData = [...(await Sensor.getAll())];
  return geData;
}

async function getData(req, res) {
  const params = req.query;
  let result = await Sensor.getFilteredData(
    params.tipo,
    params.idSensor,
    params.fechaInicio,
    params.fechaFin
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

module.exports = { getGeData, getData };
