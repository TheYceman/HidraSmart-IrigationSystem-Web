const Peticion = require("../models/peticion.model");

const { runQuery } = require("../data/bbdd-connector");

async function getGeDataPeticion(req, res) {
  const geData = [...(await Peticion.getAll())];
  return geData;
}

async function getTotalPagesPeticiones(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Peticion.getCountAll();

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}

async function getGeDataPeticionesPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Peticion.getPerPage(itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getDataPeticion(req, res) {
  const params = req.query;
  let result = await Peticion.getFilteredData(
    params.ideSector
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

async function updatePeticion(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const idPeticion = req.body.idPeticion.trim();
  const tipo = req.body.tipo.trim();
  const usuario = req.body.usuario.trim();
  const estado = req.body.estado.trim();
  const comentarios = req.body.comentarios.trim();
  const asignadaa = req.body.asignadaa.trim();

  console.log("updatePeticion " + login);

  const queryString = `UPDATE peticiones SET tipo = ?, usuario = ?, estado = ?, comentarios = ?, asignadaa = ? WHERE idPeticion = ?;`;
  const values = [tipo, usuario, estado, comentarios, asignadaa, idPeticion];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Petición actualizada con éxito");
  }
  console.log(result.data.rows);
  return result.data.rows;;

}

async function deletePeticion(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const numero = req.body.numero.trim();

  console.log("deletePeticion " + numero);

  const queryString = `DELETE FROM peticion WHERE idPeticion = ?;`
  const values = [numero];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Petición borrada correctamente");
  }
  console.log(data);
  res.redirect('/gestor-peticiones');
  //return data;

}

// Ruta para procesar el formulario de añadir
async function agregaPeticion(req, res) {

  if (!req.body)
    return res.sendStatus(400)
  console.log(req.body);

  const idPeticion = req.body.asignidPeticionadaa.trim();
  const tipo = req.body.tipo.trim();
  const usuario = req.body.usuario.trim();
  const estado = req.body.estado.trim();
  const comentarios = req.body.comentarios.trim();
  const asignadaa = req.body.asignadaa.trim();

  const queryString = `INSERT INTO peticion (idPeticion, tipo, usuario, estado, comentarios, asignadaa) VALUES (?, ?, ?, ?, ?, ?);`;
  const values = [idPeticion, tipo, usuario, estado, comentarios, asignadaa];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
      console.log("Cliente insertado correctamente");
  }
  console.log(data);

  res.redirect('/gestor-peticiones');
}

module.exports = { getGeDataPeticion, getDataPeticion, getGeDataPeticionesPerPage, updatePeticion, deletePeticion, agregaPeticion, getTotalPagesPeticiones };
