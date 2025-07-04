const Sensor = require("../models/sensor.model");

async function getGeDataRiego(req, res) {
  const geData = [...(await Sensor.getAllSensores(req, res))];
  return geData;
}

async function getGeData(req, res) {
  const params = req.query;
  let result = await Sensor.getFilteredData(req, res,
    params.tipo,
    params.idSensor,
    params.fechaInicio,
    params.fechaFin
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

module.exports = { getGeDataRiego, getGeData };
