const Equipo = require("../models/equipo.model");
const Elemento = require("../models/elemento.model");
const Contador = require("../models/contador.model");
const Sensor = require("../models/sensor.model");
const Presion = require("../models/presion.model");
const Caudalimetro = require("../models/caudalimetro.model");
const Cliente = require("../models/cliente.model");

const { runQuery } = require("../data/bbdd-connector");

async function getGeDataClientes(req, res) {
  const geData = [...(await Cliente.getAll(req, res))];
  return geData;
}

async function getGeDataContador(req, res) {
  const geData = [...(await Contador.getAll(req, res))];
  return geData;
}

async function getGeDataSensor(req, res) {
  const geData = [...(await Sensor.getAll(req, res))];
  return geData;
}

async function getGeDataContadorMapa(req, res) {
  const geData = [...(await Contador.getAll(req, res))];
  console.log("Entra a getGeDataContador desde mapa");
  //console.log(JSON.stringify(geData));
  return res.json(geData);
}

async function getGeDataContadorMapaTelemedida(req, res) {
  const geData = [...(await Contador.getTelemedida(req, res))];
  console.log("Entra a getGeDataContadorMapaTelemedida desde mapa");
  //console.log(JSON.stringify(geData));
  return res.json(geData);
}

async function getGeDataContadorMapaNoTelemedida(req, res) {
  const geData = [...(await Contador.getNoTelemedida(req, res))];
  console.log("Entra a getGeDataContadorMapaNoTelemedida desde mapa");
  //console.log(JSON.stringify(geData));
  return res.json(geData);
}

async function getGeDataSensorMapa(req, res) {
  const geData = [...(await Presion.getPresionesTelemedida(req, res))];
  console.log("Entra a getGeDataSensorMapa desde mapa");
  //console.log(JSON.stringify(geData));
  return res.json(geData);
}


async function getGeDataCaudalimetroMapa(req, res) {
  const geData = [...(await Caudalimetro.getAll(req, res))];
  console.log("Entra a getGeDataCaudalimetroMapa desde mapa");
  //console.log(JSON.stringify(geData));
  return res.json(geData);
}


async function getTotalPagesContador(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Contador.getCountAll(req, res);

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}

async function getTotalPagesEquipos(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Equipo.getCountAll(req, res);

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}

async function getTotalPagesElementos(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Elemento.getCountAll(req, res);

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}

async function getTotalPagesSensor(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Sensor.getCountAll(req, res);

  console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}

async function getGeDataSensorPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Sensor.getPerPage(req, res, itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}


async function getGeDataContadorPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Contador.getPerPage(req, res, itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getGeDataEquipoPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Equipo.getPerPage(req, res, itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getGeDataElementoPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Elemento.getPerPage(req, res, itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getDataContador(req, res) {
  const params = req.query;
  let result = await Contador.getFilteredData(
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

  console.log("Ver histórico " + id);

  //const queryString = `UPDATE ge_contadores SET ideSector = ? WHERE ideEle = ?;`
  //const values = [sector, id];
  //const database = 'aplicaciones_web';
  //const data = await runQuery(queryString, values, database);
  //console.log(data);
  //return data;

}

async function updateContador(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const id = req.body.id.trim();
  const sector = req.body.sector.trim();

  console.log("updateContador " + id);

  const queryString = `UPDATE ge_contadores SET ideSector = ? WHERE ideEle = ?;`
  const values = [sector, id];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Contador actualizado con éxito");
  }
  return result.data.rows;

}

async function deleteContador(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const id = req.body.id.trim();

  console.log("deleteContador " + id);

  const queryString = `DELETE FROM ge_contadores WHERE ideEle = ?;`
  const values = [id];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Contador borrado correctamente");
  }
  res.redirect('/gestor-equipos');
  //return data;

}

// Ruta para procesar el formulario de añadir
async function getAgregaEquipo(req, res) {
  const tipoEquipo = req.body.tipoEquipo;
  if (tipoEquipo == "contador") {
    const { ideEle, ideSector, ideRamal, ideRadio, marca, dimension, qNominal, volAsignado, coorX, coorY, calle_num, cliente } = req.body;
    //const nuevoRegistro = { ideEle, ideSector, ideRamal, ideRadio, marca, dimension, qNominal, volAsignado, coorX, coorY, calle_num, cliente };
    const queryString = 'INSERT INTO ge_contadores VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [ideEle, ideSector, ideRamal, ideRadio, marca, dimension, qNominal, volAsignado, coorX, coorY, calle_num, cliente];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
  /*else{
    const { ideEle, ideSector, ideRadio, tipo, coorX, coorY } = req.body;
    const nuevoRegistro = {  ideEle, ideSector, ideRadio, tipo, coorX, coorY  };
    connection.query('INSERT INTO ge_sensores SET ?', nuevoRegistro, (err) => {
      if (err) {
        console.error('Error al insertar en la base de datos: ' + err.message);
        res.status(500).send('Error en el servidor');
        return;
      }
      res.redirect('/');
    });
}*/



}

// Ruta para procesar el formulario de añadir
async function mostrarHistorico(req, res) {
  const { sector, tramo } = req.body;
  const nuevoRegistro = { sector, tramo };

  // Realiza una consulta a la base de datos y obtén los datos
  connection.query('SELECT * FROM tu_tabla', (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
    } else {
      res.render('historico', { datos: result });
    }
  });
}


module.exports = { getGeDataContador, getDataContador, getGeDataContadorPerPage, updateContador, deleteContador, getAgregaEquipo, getTotalPagesContador, getGeDataContadorMapa, verHistorico, mostrarHistorico, getGeDataContadorMapaTelemedida, getGeDataContadorMapaNoTelemedida, getGeDataSensorMapa, getGeDataCaudalimetroMapa, getGeDataSensor, getTotalPagesSensor, getGeDataSensorPerPage, getGeDataClientes, getGeDataEquipoPerPage, getTotalPagesEquipos, getGeDataElementoPerPage, getTotalPagesElementos };
