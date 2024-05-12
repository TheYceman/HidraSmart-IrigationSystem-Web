const { runQuery } = require("../data/bbdd-connector");

class Usuario {
  constructor(usuario) {
    this.idusers = usuario.idusers;//idusers 
    this.username = usuario.username;//username - login 
    this.password = usuario.password; //password - password
    this.name = usuario.name; //username - nombre
    this.surname = usuario.surname; //name - apellido
    this.rol = usuario.rol; //rol - grupo
    this.email = usuario.email; //email - email
    this.phone = usuario.phone; //phone - phone
    this.changecode = usuario.changecode; //changecode - emchangecode
    this.bbdd = usuario.bbdd; //bbdd - bbdd
    this.owner = usuario.owner; //owner - owner
  }

  static async getAll(req, res) {
    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT * FROM users WHERE username<>'HidraSmart' AND owner =?;";
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = "SELECT * FROM users WHERE username<>'HidraSmart';";
      }
    }
    const values = [req.session.user[0].idusers];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const usuario = results.data.rows.map((usuario) => new Usuario(usuario));
    return usuario;

  }

  static async getFilteredData(req, res, login) {

    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT * FROM users WHERE username=? AND username<>'HidraSmart' AND owner =?;";
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = "SELECT * FROM users WHERE username=? AND username<>'HidraSmart';";
      }
    }

    const values = [login, req.session.user[0].idusers];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM users WHERE username="${login}";`
    );
    return result.data.rows;
  }
  static async getFilteredDataGrupo(req, res, idGrupo) {

    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT * FROM users WHERE rol=? AND username<>'HidraSmart' AND owner =?;";
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = "SELECT * FROM users WHERE rol=? AND username<>'HidraSmart';";
      }
    }
    const values = [idGrupo, req.session.user[0].idusers];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM users WHERE rol="${idGrupo}";`
    );
    return result.data.rows;
  }

  static async getPerPage(req, res, perPage, offset) {

    let queryString = "";
    const values = [];
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT * FROM users WHERE username<>'HidraSmart' AND owner=" + req.session.user[0].idusers + " LIMIT " + perPage + " OFFSET " + offset;
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = "SELECT * FROM users WHERE username<>'HidraSmart' LIMIT " + perPage + " OFFSET " + offset;
      }
    }
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    console.log("results.data.rows " + results.data.rows);
    const usuarios = results.data.rows.map((usuario) => new Usuario(usuario));
    return usuarios;
  }

  static async getCountAll(req, res) {

    let queryString = "";
    let values = [];
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT count(*) as total FROM users WHERE username<>'HidraSmart' AND owner =?;";
      values = [req.session.user[0].idusers];
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = "SELECT count(*) as total FROM users WHERE username<>'HidraSmart'";
        values = [];
      }
    }
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllUsuarios(req, res) {

    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = "SELECT * FROM users WHERE username<>'HidraSmart' AND owner =?;";
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = "SELECT * FROM users WHERE username<>'HidraSmart';";
      }
    }
    const values = [req.session.user[0].idusers];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const usuarios = results.data.rows.map((usuario) => new Usuario(usuario));
    return usuarios;
  }

  static async getFilteredData(req, res, login) {
    let queryString = "";
    if (req.session.user[0].rol == 'userp') {
      queryString = `SELECT * FROM users WHERE login="${login}" AND username<>'HidraSmart' AND owner =?;`
    }
    else {
      if (req.session.user[0].rol == 'hidra' || req.session.user[0].rol == 'admin') {
        queryString = `SELECT * FROM users WHERE login="${login}" AND username<>'HidraSmart';`
      }
    }
    const values = [login, req.session.user[0].idusers];

    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Usuario;


