const {
  getImagenesPresentacion,
  getNoticiasData,
  getServiciosData,
  getRedData,
  getUsuariosData,
} = require("../data/placeholder_data");

const { getGeData } = require("../controllers/visor-datos.controller");

/********** Menú Inicio - Grupo 0 **********/
function getInicio(req, res) {
  res.render("navbar/inicio", {
    navIndex: 0,
    navGroup: 0,
    pageTitle: "Inicio",
    imagenesPresentacion: getImagenesPresentacion(),
  });
}

function getConocenos(req, res) {
  res.render("navbar/conocenos", {
    navIndex: 1,
    navGroup: 0,
    pageTitle: "Conócenos",
  });
}

function getNoticias(req, res) {
  res.render("navbar/noticias", {
    navIndex: 2,
    navGroup: 0,
    pageTitle: "Noticias",
    noticias: getNoticiasData(),
  });
}

function getJuntaGobierno(req, res) {
  res.render("navbar/junta-de-gobierno", {
    navIndex: 3,
    navGroup: 0,
    pageTitle: "Junta de gobierno",
  });
}

function getServicios(req, res) {
  res.render("navbar/servicios", {
    navIndex: 4,
    navGroup: 0,
    pageTitle: "Servicios",
    servicios: getServiciosData(),
  });
}

function getMapa(req, res) {
  res.render("navbar/mapa", {
    navIndex: 5,
    navGroup: 0,
    pageTitle: "Mapa",
  });
}

function getContacto(req, res) {
  res.render("navbar/mapa", {
    navIndex: 6,
    navGroup: 0,
    pageTitle: "Contacto",
  });
}

function getLogin(req, res) {
  res.render("navbar/login", {
    navIndex: 7,
    navGroup: 0,
    pageTitle: "Iniciar sesión",
  });
}

/********** Menú Herramientas - Grupo 1 **********/
function getTramitacionProcedimientos(req, res) {
  res.render("navbar/tramitacion-procedimientos", {
    navIndex: 8,
    navGroup: 1,
    pageTitle: "Procedimientos",
  });
}

function getMapaSig(req, res) {
  res.render("navbar/mapa-sig", {
    navIndex: 9,
    navGroup: 1,
    pageTitle: "Mapa SIG",
  });
}

async function getVisorDatos(req, res) {
  res.render("navbar/visor-datos", {
    navIndex: 10,
    navGroup: 1,
    pageTitle: "Visor de datos",
    today: new Date().toJSON().slice(0, 16),
    geData: await getGeData(),
  });
}

/********** Menú Gestores - Grupo 2 **********/
function getGestorNoticias(req, res) {
  res.render("navbar/gestor-noticias", {
    navIndex: 11,
    navGroup: 2,
    pageTitle: "Gestor de Noticias",
    noticias: getNoticiasData(),
  });
}

function getGestorEquipos(req, res) {
  res.render("navbar/gestor-equipos", {
    navIndex: 12,
    navGroup: 2,
    pageTitle: "Gestor de Equipos",
  });
}

function getGestorRiegos(req, res) {
  res.render("navbar/gestor-riegos", {
    navIndex: 13,
    navGroup: 2,
    pageTitle: "Gestor de Riegos",
  });
}

function getGestorRed(req, res) {
  res.render("navbar/gestor-red", {
    navIndex: 14,
    navGroup: 2,
    pageTitle: "Gestor de Red",
    red: getRedData(),
  });
}

function getGestorUsuarios(req, res) {
  res.render("navbar/gestor-usuarios", {
    navIndex: 15,
    navGroup: 2,
    pageTitle: "Gestor de Usuarios",
    usuarios: getUsuariosData(),
  });
}

module.exports = {
  getInicio,
  getConocenos,
  getNoticias,
  getJuntaGobierno,
  getServicios,
  getMapa,
  getContacto,
  getLogin,
  getTramitacionProcedimientos,
  getMapaSig,
  getVisorDatos,
  getGestorNoticias,
  getGestorEquipos,
  getGestorRiegos,
  getGestorRed,
  getGestorUsuarios,
};
