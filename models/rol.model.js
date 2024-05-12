const { runQuery } = require("../data/bbdd-connector");

class Rol {
  constructor(rol) {
    this.nombre = rol.nombre;//nombre
    this.perUsu = rol.perUsu;//permiso para el gestor de usuarios 
    this.perVisor = rol.perVisor; //permiso para el visor
    this.perMeteo = rol.perMeteo; //permiso para el gestor meteorológico 
    this.perRed = rol.perRed; //permiso para el gestor de red 
    this.perDemandas = rol.perDemandas; //permiso para el gestor de demandas 
    this.perRiego = rol.perRiego; //permiso para el gestor de riegos
    this.perEquipos = rol.perEquipos; //permiso para el gestor de riegos
    this.propietario = rol.propietario; //propietario del grupo
  }

  static async getAll(req, res) {

    console.log("getAll " + req.session.user[0].idusers);
    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT * FROM grupos_usuario WHERE nombre<>'admin' AND propietario =?;";
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = "SELECT * FROM grupos_usuario WHERE nombre<>'admin';";
      }
    }
    const values = [req.session.user[0].idusers];

    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const rol = results.data.rows.map((rol) => new Rol(rol));
    return rol;
  }

  static async getFilteredData(req, res, nombre) {
    console.log("getFilteredData " + req.session.user[0].idusers);
    let queryString = "";
    if (req.session.user[0].rol  == 'userp') {
      queryString = "SELECT * FROM grupos_usuario WHERE nombre=? AND nombre<>'admin' AND propietario =?;";
    }
    else {
      if (req.session.user[0].rol  == 'hidra' || req.session.user[0].rol  == 'admin') {
        queryString = "SELECT * FROM grupos_usuario WHERE nombre=? AND nombre<>'admin';";
      }
    }
    const values = [nombre, req.session.user[0].idusers];

    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM grupos_usuario WHERE nombre="${nombre}";`
    );
    return result.data.rows;
  }
  static async getFilteredDataGrupo(req, res, idGrupo) {
    console.log("getFilteredDataGrupo " + req.session.user[0].idusers);
    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT * FROM grupos_usuario WHERE nombre=? AND nombre<>'admin' AND propietario =?;";
    }
    else {
      if (req.session.user[0].rol  == 'hidra' || req.session.user[0].rol  == 'admin') {
        queryString = "SELECT * FROM grupos_usuario WHERE nombre=? AND nombre<>'admin';";
      }
    }
    const values = [idGrupo, req.session.user[0].idusers];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM grupos_usuario WHERE nombre="${idGrupo}";`
    );
    return result.data.rows;
  }

  static async getPerPage(req, res, perPage, offset) {
    console.log("getPerPage " + req.session.user[0].idusers );

    let queryString = "";
    let values = [];
    if (req.session.user[0].rol  == 'userp') {
      queryString = "SELECT * FROM grupos_usuario WHERE nombre<>'admin' AND propietario =" + req.session.user[0].idusers + " LIMIT " + perPage + " OFFSET " + offset;
    }
    else {
      if (req.session.user[0].rol  == 'hidra' || req.session.user[0].rol  == 'admin') {
        queryString = "SELECT * FROM grupos_usuario WHERE nombre<>'admin' LIMIT " + perPage + " OFFSET " + offset;
      }
    }

    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const roles = results.data.rows.map((rol) => new Rol(rol));
    console.log("getPerPage " + roles );
    return roles;
  }

  static async getCountAll(req, res) {
    console.log("getCountAll " + req.session.user[0].idusers );
    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT count(*) as total FROM grupos_usuario WHERE nombre<>'admin' AND propietario =?;";
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol  == 'admin') {
        queryString = "SELECT count(*) as total FROM grupos_usuario WHERE nombre<>'admin';";
      }
    }
    const values = [req.session.user[0].idusers];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllRoles(req, res) {
    console.log("getCountAll " + req.session.user[0].idusers );
    let queryString = "";
    if (req.session.user[0].rol  == 'userp') {
      queryString = "SELECT * FROM grupos_usuario WHERE nombre<>'admin' AND propietario =?;";
    }
    else {
      if (req.session.user[0].rol  == 'hidra' || req.session.user[0].rol  == 'admin') {
        queryString = "SELECT * FROM grupos_usuario WHERE nombre<>'admin';";
      }
    }
    const values = [req.session.user[0].idusers];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const roles = results.data.rows.map((rol) => new Rol(rol));
    return roles;
  }

  static async getFilteredData(req, res, nombre) {
    console.log("getFilteredData " + req.session.user[0].idusers);
    let queryString = "";
    let values = [];
    if (req.session.user[0].rol  == 'userp') {
      queryString = "SELECT * FROM grupos_usuario WHERE nombre=? AND nombre<>'admin' AND propietario =?;";
      values = [nombre, req.session.user[0].idusers];
    }
    else {
      if (req.session.user[0].rol  == 'hidra' || req.session.user[0].rol  == 'admin') {
        queryString = "SELECT * FROM grupos_usuario WHERE nombre=? AND nombre<>'admin';";
        values = [nombre];
      }
    }

    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Rol;


