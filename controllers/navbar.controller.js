//const {  getRedData,  getUsuariosData,} = require("../data/placeholder_data");

const { getGeData } = require("./estado-red.controller");
const { getGeDataRiego } = require("../controllers/planificador-riego.controller");

//const { getGeDataContador } = require("../controllers/gestor-equipos.controller");
const { getGeDataEquipoPerPage } = require("../controllers/gestor-equipos.controller");
const { getGeDataElementoPerPage } = require("../controllers/gestor-equipos.controller");
const { getGeDataSensorPerPage } = require("../controllers/gestor-equipos.controller");
const { getTotalPagesSensor } = require("../controllers/gestor-equipos.controller");
//const { getTotalPagesContador } = require("../controllers/gestor-equipos.controller");
const { getTotalPagesEquipos } = require("../controllers/gestor-equipos.controller");
const { getAllEquipos } = require("../models/equipo.model");
const { getAllElementos } = require("../models/elemento.model");
const { getAll } = require("../models/contador.model");
const { getAllSensores } = require("../models/sensor.model");
const { getGeDataClientes } = require("../controllers/gestor-equipos.controller");

const { getAllParcelas } = require("../models/parcela.model");
const { getGeDataParcelaPerPage } = require("../controllers/gestor-cultivos.controller");
const { getTotalPagesParcela } = require("../controllers/gestor-cultivos.controller");

//const { getGeDataUsuario } = require("../controllers/gestor-usuarios.controller");
const { getGeDataUsuariosPerPage } = require("../controllers/gestor-usuarios.controller");
const { getTotalPagesUsuarios } = require("../controllers/gestor-usuarios.controller");
const { getAllUsuarios } = require("../models/usuario.model");

const { getGeDataRolesPerPage } = require("../controllers/gestor-roles.controller");
const { getTotalPagesRoles } = require("../controllers/gestor-roles.controller");
const { getAllRoles } = require("../models/rol.model");

//const { getGeDataPeticion } = require("../controllers/gestor-peticiones.controller");
const { getGeDataPeticionesPerPage } = require("../controllers/gestor-peticiones.controller");
const { getTotalPagesPeticiones } = require("../controllers/gestor-peticiones.controller");
const { getAllPeticiones, getCountAll, getCountPendientes, getCountAsignadasAMi, getCountAprobadas, getCountAsignadas, getCountRechazadas } = require("../models/peticion.model");


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
  //console.log("No encuentra form_send!");
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

    const queryString = 'UPDATE session_logs SET end_time = ? WHERE idusers = ? AND session_id = ?';
    const values = [endTime, userId, sesion_id];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    if (results.success) {
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
    profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
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
    profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
    todosLosContadores: await getAll(req, res),
  });
}

async function getEstadoRed(req, res) {
  res.render("navbar/estado-red", {
    headImage: req.session.headImage,
    navIndex: 3,
    navGroup: 1,
    pageTitle: "Estado de la red",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
    todosLosContadores: await getAll(req, res),
    user: req.session.username,
  });
}

async function getInfoMeteo(req, res) {
  res.render("navbar/info-meteo", {
    headImage: req.session.headImage,
    navIndex: 4,
    navGroup: 1,
    pageTitle: "Información meteorológica",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    today: new Date().toJSON().slice(0, 16),
    //geData: await getGeData(),
    user: req.session.username,
    todosLosContadores: await getAll(req, res),
  });
}

async function getDemandasCultivos(req, res) {

  if (req.session.user[0].rol === 'admin') {
    res.render("navbar/gestor-cultivos-admin", {
      headImage: req.session.headImage,
      navIndex: 5,
      navGroup: 1,
      pageTitle: "Gestor cupos y cultivos",
      headComunityLogo: req.session.headCommunityImage,
      headComunityName: req.session.headCommunityName,
      headComunityUrl: req.session.headCommunityUrl,
      profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
      profileUserEmail: req.session.user[0].email,
      today: new Date().toJSON().slice(0, 16),
      geData: await getGeData(),
      user: req.session.username,
      todasLasParcelas: await getAllParcelas(req, res),
      currentPage: parseInt(req.query.page) || 1,
      totalPages: await getTotalPagesParcela(req, res),
      parcelas: await getGeDataParcelaPerPage(req, res),
    });
  }
  else {
    res.render("navbar/gestor-cultivos", {
      headImage: req.session.headImage,
      navIndex: 5,
      navGroup: 1,
      pageTitle: "Gestor cupos y cultivos",
      headComunityLogo: req.session.headCommunityImage,
      headComunityName: req.session.headCommunityName,
      headComunityUrl: req.session.headCommunityUrl,
      profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
      profileUserEmail: req.session.user[0].email,
      today: new Date().toJSON().slice(0, 16),
      geData: await getGeData(),
      user: req.session.username,
      todasLasParcelas: await getAllParcelas(req, res),
      currentPage: parseInt(req.query.page) || 1,
      totalPages: await getTotalPagesParcela(req, res),
      parcelas: await getGeDataParcelaPerPage(req, res),
    });
  }

}

async function getPlanRiego(req, res) {
  //Datos para maniobras
  const data = [
    {
      identificador: 'L021',
      caudal: 44.0,
      estadoVal: 'Cerrado',
      accion1: 'Abrir',
      instanteAccion1: '14/06/2024 00:00',
      estadoAccion1: 'Completada',
      accion2: 'Cerrar',
      instanteAccion2: '14/06/2024 01:00',
      estadoAccion2: 'Completada'
    },
    {
      identificador: 'L012',
      caudal: 110.0,
      estadoVal: 'Cerrado',
      accion1: 'Abrir',
      instanteAccion1: '14/06/2024 07:55',
      estadoAccion1: 'Completada',
      accion2: 'Cerrar',
      instanteAccion2: '14/06/2024 13:55',
      estadoAccion2: 'Pendiente'
    },
    {
      identificador: 'L018',
      caudal: 130.0,
      estadoVal: 'Cerrado',
      accion1: 'Abrir',
      instanteAccion1: '14/06/2024 07:58',
      estadoAccion1: 'Completada',
      accion2: 'Cerrar',
      instanteAccion2: '14/06/2024 19:58',
      estadoAccion2: 'Pendiente'
    }
  ];

  res.render("navbar/planificador-riego", {
    headImage: req.session.headImage,
    navIndex: 6,
    navGroup: 1,
    pageTitle: "Planificador de riego",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    today: new Date().toJSON().slice(0, 16),
    getGeDataRiego: await getGeDataRiego(),
    user: req.session.username,
    data: data
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
    profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
    contadores: await getGeDataEquipoPerPage(req, res),
    todosLosContadores: await getAllEquipos(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesEquipos(req, res),
    sensores: await getGeDataSensorPerPage(req, res),
    currentPageSensor: parseInt(req.query.pageSensor) || 1,
    totalPagesSensor: await getTotalPagesSensor(req, res),
    todosLosSensores: await getAllSensores(req, res),
    clientes: await getGeDataClientes(req, res),
    todosLosElementos: await getAllElementos(req, res),
    equipos: await getGeDataElementoPerPage(req, res),
  });
}


/********** Menú Gestores - Grupo 2 **********/


async function getGestorPeticiones(req, res) {
  //console.log("GetGestorPeticiones " + req.session.headImage);
  res.render("navbar/gestor-peticiones", {
    headImage: req.session.headImage,
    navIndex: 8,
    navGroup: 2,
    pageTitle: "Gestor de peticiones",
    headComunityLogo: req.session.headCommunityImage,
    headComunityName: req.session.headCommunityName,
    headComunityUrl: req.session.headCommunityUrl,
    profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
    profileUserEmail: req.session.user[0].email,
    user: req.session.username,
    userId: req.session.user[0].idusers,
    peticiones: await getGeDataPeticionesPerPage(req, res),
    todasLasPeticiones: await getAllPeticiones(req, res),
    currentPage: parseInt(req.query.page) || 1,
    totalPages: await getTotalPagesPeticiones(req, res),
    numeroPeticiones: await getCountAll(req, res),
    numeroPendientes: await getCountPendientes(req, res),
    asignadasAMi: await getCountAsignadasAMi(req, res),
    numeroAprobadas: await getCountAprobadas(req, res),
    numeroAsignadas: await getCountAsignadas(req, res),
    numeroRechazadas: await getCountRechazadas(req, res),
  });
}

async function getGestorUsuarios(req, res) {

  const rol = req.session.user[0].rol;
  //console.log("req.session.user[0].rol " + rol);

  if (rol == 'hidra' || rol == 'admin' || rol == 'userp') {
    res.render("navbar/gestor-usuarios", {
      headImage: req.session.headImage,
      navIndex: 9,
      navGroup: 2,
      pageTitle: "Gestor de Usuarios",
      headComunityLogo: req.session.headCommunityImage,
      headComunityName: req.session.headCommunityName,
      headComunityUrl: req.session.headCommunityUrl,
      profileUserName: req.session.user[0].name + " " + req.session.user[0].surname,
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
  else {
    console.log("No tiene permisos para ver este recurso");
    res.redirect('/panel_aplicaciones');
  }


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
