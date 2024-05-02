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
    this.changecode = usuario.changecode; //email - email
    this.bbdd = usuario.bbdd; //phone - phone
  }

  static async getAll() {

    const queryString = "SELECT * FROM users;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const usuario = results.data.rows.map((usuario) => new Usuario(usuario));
    return usuario;

  }

  static async getFilteredData(login) {

    const queryString = "SELECT * FROM users WHERE username=?;";
    const values = [login];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM users WHERE username="${login}";`
    );
    return result.data.rows;
  }
  static async getFilteredDataGrupo(idGrupo) {

    const queryString = "SELECT * FROM users WHERE rol=?;";
    const values = [idGrupo];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM users WHERE rol="${idGrupo}";`
    );
    return result.data.rows;;
  }

  static async getPerPage(perPage, offset) {

    const queryString = "SELECT * FROM users LIMIT " + perPage + " OFFSET " + offset;
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, [], database);
    console.log("results.data.rows " + results.data.rows);
    const usuarios = results.data.rows.map((usuario) => new Usuario(usuario));
    return usuarios;
  }

  static async getCountAll() {

    const queryString = "SELECT count(*) as total FROM users;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllUsuarios() {

    const queryString = "SELECT * FROM users;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const usuarios = results.data.rows.map((usuario) => new Usuario(usuario));
    return usuarios;
  }

  static async getFilteredData(login) {

    const queryString = `SELECT * FROM users WHERE login=${login}";`
    const values = [login];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Usuario;


