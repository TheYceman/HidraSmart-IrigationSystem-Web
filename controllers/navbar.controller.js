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
const { getGeDataClientes } = require("../controllers/gestor-equipos.controller");

const { getGeDataUsuario } = require("../controllers/gestor-usuarios.controller");
const { getGeDataUsuariosPerPage } = require("../controllers/gestor-usuarios.controller");
const { getTotalPagesUsuarios } = require("../controllers/gestor-usuarios.controller");
const { getAllUsuarios } = require("../models/usuario.model");

const { getGeDataRolesPerPage } = require("../controllers/gestor-roles.controller");
const { getTotalPagesRoles } = require("../controllers/gestor-roles.controller");
const { getAllRoles } = require("../models/rol.model");

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
    user: ''

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
    user: ''
  });
}

async function getLogout(req, res) {

  const userId = req.session.idUsuario; // Suponiendo que tienes el ID del usuario en la sesión
  const sesion_id = req.sessionID;
  var offset = new Date().getTimezoneOffset();
  var d = new Date();
  var madridTime = new Date(d.getTime() - (offset * 60 * 1000));
  const endTime = madridTime.toISOString().slice(0, 19).replace('T', ' ');

  if (userId) {

    const queryString =  'UPDATE session_logs SET end_time = ? WHERE idusers = ? AND session_id = ?';
    const values = [endTime, userId, sesion_id];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    if(results.success){
      console.log("getLogout " + results + " userId " + userId + " sesión " + req.sessionID);
    }
  }

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
    headImage: req.session.headImage,
    navIndex: 1,
    navGroup: 0,
    pageTitle: "Panel de aplicacion",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
  });
}

async function getMapaSig(req, res) {
  res.render("navbar/mapa-sig", {
    headImage: req.session.headImage,
    navIndex: 2,
    navGroup: 1,
    pageTitle: "Visor",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
    todosLosContadores: await getAll(req, res),
  });
}

async function getEstadoRed(req, res) {
  res.render("navbar/visor-datos", {
    headImage: req.session.headImage,
    navIndex: 3,
    navGroup: 1,
    pageTitle: "Estado de la red",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}

async function getInfoMeteo(req, res) {
  res.render("navbar/visor-datos", {
    headImage: req.session.headImage,
    navIndex: 4,
    navGroup: 1,
    pageTitle: "Información meteorológica",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}

async function getDemandasCultivos(req, res) {
  res.render("navbar/visor-datos", {
    headImage: req.session.headImage,
    navIndex: 5,
    navGroup: 1,
    pageTitle: "Gestor demandas y cultivos",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}

async function getPlanRiego(req, res) {
  res.render("navbar/visor-datos", {
    headImage: req.session.headImage,
    navIndex: 6,
    navGroup: 1,
    pageTitle: "Planificador de riego",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    user: req.session.username,
  });
}
async function getGestorEquipos(req, res) {
  res.render("navbar/gestor-equipos", {
    headImage: req.session.headImage,
    navIndex: 7,
    navGroup: 1,
    pageTitle: "Gestor de Equipos",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
    contadores: await getGeDataContadorPerPage(req, res),
    todosLosContadores: await getAll(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesContador(req, res),
    sensores: await getGeDataSensorPerPage(req, res),
    currentPageSensor: parseInt(req.query.pageSensor) || 1,
    totalPagesSensor: await getTotalPagesSensor(req, res),
    todosLosSensores: await getAllSensores(req, res),
    clientes: await getGeDataClientes(req, res),
  });
}


/********** Menú Gestores - Grupo 2 **********/


async function getGestorPeticiones(req, res) {
  res.render("navbar/gestor-peticiones", {
    headImage: req.session.headImage,
    navIndex: 8,
    navGroup: 2,
    pageTitle: "Gestor de peticiones",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
    clientes: await getGeDataClientesPerPage(req, res),
    todosLosClientes: await getAllClientes(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesClientes(req, res),
  });
}

async function getGestorUsuarios(req, res) {
  res.render("navbar/gestor-usuarios", {
    headImage: req.session.headImage,
    navIndex: 9,
    navGroup: 2,
    pageTitle: "Gestor de Usuarios",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName:  req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
    usuarios: await getGeDataUsuariosPerPage(req, res),
    todosLosUsuarios: await getAllUsuarios(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesUsuarios(req, res),
    roles: await getGeDataRolesPerPage(req, res),
    todosLosRoles: await getAllRoles(req, res),
    currentPageRoles: parseInt(req.query.page) || 1,
    totalPagesRoles: await getTotalPagesRoles(req, res),
  });
}

module.exports = {
  getLogin,
  getMapaSig,
  getEstadoRed,
  getInfoMeteo,
  getDemandasCultivos,
  getPlanRiego,
  getGestorEquipos,
  getGestorPeticiones,
  getGestorUsuarios,
  getLogout,
  getDashboard,
  getSoporte,
  getRespuestaContacto,
};
