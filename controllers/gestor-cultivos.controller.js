const Parcela = require("../models/parcela.model");
const Cultivo = require("../models/cultivo.model");

async function getGeDataParcela(req, res) {
  const geData = [...(await Parcela.getAll(req, res))];
  return geData;
}


async function getTotalPagesParcela(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Parcela.getCountAll(req, res);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}


async function getGeDataParcelaPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Parcela.getPerPage(req, res, itemsPerPage, offset))];

  return geData;
}


async function getDataParcela(req, res) {
  const params = req.query;
  let result = await Parcela.getFilteredData(
    req, res, params.ideSector
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

async function verHistorico(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const id = req.body.id.trim();
  const sector = req.body.sector.trim();
  const tramo = req.body.tramo.trim();

}

async function updateCultivo(req, res) {

}

async function deleteCultivo(req, res) {

}

// Ruta para procesar el formulario de añadir
async function getAgregaCultivo(req, res) {

}

async function getGeDataCultivo(req, res) {
  const geData = [...(await Cultivo.getAllCultivos(req, res))];
  return geData;
}

async function getTotalPagesCultivo(req, res) {
  let pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Cultivo.getCountAll(req, res);

  if (number_registers > 0) {
    pages = Math.ceil(number_registers / itemsPerPage);
  }

  return pages;
}

async function getGeDataCultivoPerPage(req, res) {
  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Cultivo.getPerPage(req, res, itemsPerPage, offset))];
  return geData;
}

async function getDataCultivo(req, res) {

  const params = req.query;
  let result = await Cultivo.getFilteredData(req, res, params.idParcela);
  console.log("getDataCultivo params:", JSON.stringify(result));
  res.json(result);
  
}

async function updateCultivo(req, res) {
  // Implementa la lógica para actualizar un cultivo en la base de datos
}

async function deleteCultivo(req, res) {
  // Implementa la lógica para eliminar un cultivo de la base de datos
}

async function getAgregaCultivo(req, res) {
  // Aquí puedes implementar la lógica para mostrar el formulario de agregar un cultivo
}

module.exports = {
  getGeDataCultivo,
  getDataCultivo,
  getGeDataCultivoPerPage,
  getTotalPagesCultivo,
  updateCultivo,
  deleteCultivo,
  getAgregaCultivo,
  getGeDataParcela, 
  getDataParcela, 
  getGeDataParcelaPerPage, 
  getTotalPagesParcela, 
  updateCultivo, 
  deleteCultivo, 
  getAgregaCultivo, 
  verHistorico
};
