const Usuario = require("../models/usuario.model");

const { runQuery } = require("../data/bbdd-connector");

async function getGeDataUsuario(req, res) {
  const geData = [...(await Usuario.getAll())];
  return geData;
}


async function getTotalPagesUsuarios(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Usuario.getCountAll();

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}


async function getGeDataUsuariosPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Usuario.getPerPage(itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getDataUsuario(req, res) {
  const params = req.query;
  let result = await Usuario.getFilteredData(
    params.ideSector
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

async function updateUsuario(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const login = req.body.login.trim();
  const nombre = req.body.nombre.trim();
  const apellido = req.body.apellido.trim();
  const grupo = req.body.grupo.trim();
  const email = req.body.email.trim();
  const phone = req.body.phone.trim();
  //const password = req.body.password.trim();

  console.log("updateUsuario " + login);

  const queryString = `UPDATE users SET name = ?, surname = ?, rol = ?, email = ?, phone = ? WHERE username = ?;`;
  const values = [nombre, apellido, grupo, email, phone, login];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Usuario actualizado con éxito");
  }
  return result.data.rows;;

}

async function deleteUsuario(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const login = req.body.login.trim();

  console.log("deleteUsuario " + login);

  const queryString = `DELETE FROM users WHERE username = ?;`;
  const values = [login];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Usuario borrado con éxito");
  }
  res.redirect('/gestor-usuarios');
  //return data;

}

// Ruta para procesar el formulario de añadir
async function agregaUsuario(req, res) {

  if (!req.body)
    return res.sendStatus(400)
  console.log(req.body);

  const login = req.body.login.trim();
  const nombre = req.body.nombre.trim();
  const apellido = req.body.apellido.trim();
  const grupo = req.body.grupo.trim();
  const email = req.body.email.trim();
  const phone = req.body.phone.trim();

  const password = "Pruebas2023";
  //const nuevoRegistro = { login, password, nombre, apellido, grupo, email, phone };

  const queryString = `INSERT INTO users (username, password, name, surname, rol, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  const values = [login, password, nombre, apellido, grupo, email, phone];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Usuario insertado con éxito");
  }

  res.redirect('/gestor-usuarios');
}

module.exports = { getGeDataUsuario, getDataUsuario, getGeDataUsuariosPerPage, updateUsuario, deleteUsuario, agregaUsuario, getTotalPagesUsuarios };
