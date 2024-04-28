const Cliente = require("../models/cliente.model");

const { runQuery } = require("../data/bbdd-connector");

async function getGeDataCliente(req, res) {
  const geData = [...(await Cliente.getAll())];
  return geData;
}

async function getTotalPagesClientes(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Cliente.getCountAll();

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}

async function getGeDataClientesPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Cliente.getPerPage(itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getDataCliente(req, res) {
  const params = req.query;
  let result = await Cliente.getFilteredData(
    params.ideSector
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

async function updateCliente(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const numero = req.body.numero.trim();
  const nombre = req.body.nombre.trim();
  const dni = req.body.dni.trim();
  const email = req.body.email.trim();
  const telefono = req.body.telefono.trim();

  console.log("updateCliente " + login);

  const data = await runQuery(`UPDATE Clientes SET nombre = '${nombre}',dni = '${dni}',email = '${email}',telefono = '${telefono}' WHERE idcliente = '${numero}';`);
  console.log(data);
  return data;

}

async function deleteCliente(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const numero = req.body.numero.trim();

  console.log("deleteCliente " + numero);

  const data = await runQuery(`DELETE FROM clientes WHERE idcliente = '${numero}';`);
  console.log(data);
  res.redirect('/gestor-clientes');
  //return data;

}

// Ruta para procesar el formulario de añadir
async function agregaCliente(req, res) {

  if (!req.body)
    return res.sendStatus(400)
  console.log(req.body);

  const numero = req.body.numero.trim();
  const nombre = req.body.nombre.trim();
  const dni = req.body.dni.trim();
  const email = req.body.email.trim();
  const telefono = req.body.telefono.trim();

  const data = await runQuery(`INSERT INTO clientes (idcliente, nombre, dni, email, telefono) VALUES ('${numero}', '${nombre}', '${dni}', '${email}', '${telefono}');`);
  console.log(data);

  res.redirect('/gestor-clientes');
}

module.exports = { getGeDataCliente, getDataCliente, getGeDataClientesPerPage, updateCliente, deleteCliente, agregaCliente, getTotalPagesClientes };
