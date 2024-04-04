const {
  getRedData,
  getUsuariosData,
} = require("../data/placeholder_data");

const { getGeData } = require("../controllers/visor-datos.controller");

const { getGeDataContador } = require("../controllers/gestor-equipos.controller");
const { getGeDataContadorPerPage } = require("../controllers/gestor-equipos.controller");
const { getGeDataSensorPerPage } = require("../controllers/gestor-equipos.controller");
const { getTotalPagesSensor } = require("../controllers/gestor-equipos.controller");
const { getTotalPagesContador } = require("../controllers/gestor-equipos.controller");
const { getAll } = require("../models/contador.model");
const { getAllSensores } = require("../models/sensor.model");
const {getGeDataClientes} = require("../controllers/gestor-equipos.controller");

const { getGeDataUsuario } = require("../controllers/gestor-usuarios.controller");
const { getGeDataUsuariosPerPage } = require("../controllers/gestor-usuarios.controller");
const { getTotalPagesUsuarios } = require("../controllers/gestor-usuarios.controller");
const { getAllUsuarios } = require("../models/usuario.model");

const { getGeDataCliente } = require("../controllers/gestor-clientes.controller");
const { getGeDataClientesPerPage } = require("../controllers/gestor-clientes.controller");
const { getTotalPagesClientes } = require("../controllers/gestor-clientes.controller");
const { getAllClientes } = require("../models/cliente.model");


const { runQuery } = require("../data/bbdd-connector");

/********** Menú Inicio - Grupo 0 **********/

function getLogin(req, res) {
  res.render("/", {
    navIndex: 6,
    navGroup: 0,
    pageTitle: "Iniciar sesión",
    user:''
    
  });
}

function getSoporte(req, res) {
  res.render("navbar/support", {
    navIndex: 6,
    navGroup: 0,
    pageTitle: "Contacto",    
  });
}

function getRespuestaContacto(req, res) {
  console.log("No encuentra form_send!");
  res.render("navbar/form_send", {
    navIndex: 6,
    navGroup: 0,
    pageTitle: "Contacto recibido",
    user:''
  });
}

async function getLogout(req, res) {

  const userId = req.session.idUsuario; // Suponiendo que tienes el ID del usuario en la sesión
  const sesion_id = req.sessionID;
  const endTime =  new Date().toISOString().slice(0, 19).replace('T', ' ');

  const query = 'UPDATE session_logs SET end_time = "'+endTime+'" WHERE idusers = '+userId+' AND session_id = "'+sesion_id+'"';
  const results = await runQuery(query);
  console.log ("getLogout " + results + " userId " + userId+ " sesión " + req.sessionID); 
  // Destruye la sesión actual
  req.session.destroy((err) => {
    if (err) {
        console.error('Error al cerrar la sesión: ' + err.message);
        res.send('Error al cerrar la sesión');
    } else {
        res.redirect('/'); // Redirige al usuario a la página de inicio u otra página deseada
    }
});
}

/********** Menú Herramientas - Grupo 1 **********/

function getDashboard(req, res) {
  res.render("navbar/panel_aplicaciones", {
    navIndex: 7,
    navGroup: 0,
    pageTitle: "Panel de aplicacion",
    user: req.session.username,
  });
}

async function getMapaSig(req, res) {
  res.render("navbar/mapa-sig", {
    navIndex: 9,
    navGroup: 1,
    pageTitle: "Visor",
    user: req.session.username,
    todosLosContadores: await getAll(req, res),
  });
}

async function getVisorDatos(req, res) {
  res.render("navbar/visor-datos", {
    navIndex: 10,
    navGroup: 1,
    pageTitle: "Estado de la red",
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}

async function getVisorDatos(req, res) {
  res.render("navbar/visor-datos", {
    navIndex: 11,
    navGroup: 1,
    pageTitle: "Información meteorológica",
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}

async function getVisorDatos(req, res) {
  res.render("navbar/visor-datos", {
    navIndex: 12,
    navGroup: 1,
    pageTitle: "Gestor Parcelas",
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}

async function getVisorDatos(req, res) {
  res.render("navbar/visor-datos", {
    navIndex: 13,
    navGroup: 1,
    pageTitle: "Planificador de riego",
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}

/********** Menú Gestores - Grupo 2 **********/

async function getGestorEquipos(req, res) {
  res.render("navbar/gestor-equipos", {
    navIndex: 12,
    navGroup: 2,
    pageTitle: "Gestor de Equipos",
    user: req.session.username,
    contadores: await getGeDataContadorPerPage(req, res),
    todosLosContadores: await getAll(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesContador(req, res),
    sensores: await getGeDataSensorPerPage(req, res),
    currentPageSensor: parseInt(req.query.pageSensor) || 1,
    totalPagesSensor: await getTotalPagesSensor(req, res),
    todosLosSensores: await getAllSensores(req, res),
    clientes:  await getGeDataClientes(req, res),
  });
}

async function getGestorClientes(req, res) {
  res.render("navbar/gestor-clientes", {
    navIndex: 14,
    navGroup: 2,
    pageTitle: "Gestor de clientes",
    user: req.session.username,
    clientes: await getGeDataClientesPerPage(req, res),
    todosLosClientes : await getAllClientes(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesClientes(req, res),
  });
}

async function getGestorUsuarios(req, res) {
  res.render("navbar/gestor-usuarios", {
    navIndex: 15,
    navGroup: 2,
    pageTitle: "Gestor de Usuarios",
    user: req.session.username,
    usuarios: await getGeDataUsuariosPerPage(req, res),
    todosLosUsuarios: await getAllUsuarios(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesUsuarios(req, res),
  });
}

module.exports = {
  getLogin,
  getMapaSig,
  getVisorDatos,
  getGestorEquipos,
  getGestorClientes,
  getGestorUsuarios,
  getLogout,
  getDashboard,
  getSoporte,
  getRespuestaContacto,
};
