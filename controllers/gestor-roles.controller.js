const Rol = require("../models/rol.model");

const { runQuery } = require("../data/bbdd-connector");

async function getGeDataRol(req, res) {
  const geData = [...(await Rol.getAll())];
  return geData;
}


async function getTotalPagesRoles(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Rol.getCountAll();

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}


async function getGeDataRolesPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Rol.getPerPage(itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getDataRol(req, res) {
  const params = req.query;
  let result = await Rol.getFilteredData(
    params.ideSector
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

async function updateRol(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const nombre = req.body.nombre.trim();
  const perUsu = req.body.perUsu.trim();
  const perVisor = req.body.perVisor.trim();
  const perMeteo = req.body.perMeteo.trim();
  const perRed = req.body.perRed.trim();
  const perDemandas = req.body.perDemandas.trim();
  const perRiego = req.body.perRiego.trim();
  const perEquipos = req.body.perEquipos.trim();

  console.log("updateRol " + nombre);

  const queryString = `UPDATE grupos_usuario SET perUsu = ?,perVisor = ?, perMeteo = ?, perRed = ?, perDemandas = ?, perRiego = ?, perRiego = ? WHERE nombre = ?;`;
  const values = [perUsu, perVisor, perMeteo, perRed, perDemandas, perRiego, perEquipos, nombre];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Rol actualizado con éxito");
  }
  return result.data.rows;;

}

async function deleteRol(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const nombre = req.body.nombre.trim();

  console.log("deleteRol " + nombre);

  const queryString = `DELETE FROM grupos_usuario WHERE nombre = ?;`
  const values = [nombre];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Rol borrado con éxito");
  }
  res.redirect('/gestor-usuarios');
  //return data;

}

// Ruta para procesar el formulario de añadir
async function agregaRol(req, res) {

  if (!req.body)
    return res.sendStatus(400)
  console.log(req.body);

  const nombre = req.body.nombre.trim();
  const perUsu = req.body.perUsu.trim();
  const perVisor = req.body.perVisor.trim();
  const perMeteo = req.body.perMeteo.trim();
  const perRed = req.body.perRed.trim();
  const perDemandas = req.body.perDemandas.trim();
  const perRiego = req.body.perRiego.trim();
  const perEquipos = req.body.perEquipos.trim();

  const queryString = `INSERT INTO grupos_usuario (nombre, perUsu, perVisor, perMeteo, perRed, perDemandas, perRiego, perEquipos) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  const values = [nombre, perUsu, perVisor, perMeteo, perRed, perDemandas, perRiego, perEquipos];
  const database = 'aplicaciones_web';
  const resullt = await runQuery(queryString, values, database);

  if (result.success) {
    console.log("Rol insertado con éxito");
  }

  res.redirect('/gestor-usuarios');
}

module.exports = { getGeDataRol, getDataRol, getGeDataRolesPerPage, updateRol, deleteRol, agregaRol, getTotalPagesRoles };
