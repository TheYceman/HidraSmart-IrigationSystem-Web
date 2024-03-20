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
    const data = await runQuery("SELECT * FROM users;");
    const usuario = data.map((usuario) => new Usuario(usuario));
    return usuario;
  }

  static async getFilteredData(login) {
    const data = await runQuery(
      `SELECT * FROM users WHERE username="${login}";`
    );
    console.log(
      `SELECT * FROM users WHERE username="${login}";`
    );
    return data;
  }
  static async getFilteredDataGrupo(idGrupo) {
    const data = await runQuery(
      `SELECT * FROM users WHERE rol="${idGrupo}";`
    );
    console.log(
      `SELECT * FROM users WHERE rol="${idGrupo}";`
    );
    return data;
  }

  static async getPerPage(perPage, offset) {
    const data = await runQuery("SELECT * FROM users LIMIT " + perPage + " OFFSET " + offset + ";");
    const usuarios = data.map((usuario) => new Usuario(usuario));
    return usuarios;
  }

  static async getCountAll() {
    const data = await runQuery("SELECT count(*) as total FROM users;");
    const geTotal = data.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllUsuarios() {
    const data = await runQuery("SELECT * FROM users;");
    const usuarios = data.map((usuario) => new Usuario(usuario));
    return usuarios;
  }

  static async getFilteredData(login) {
    const data = await runQuery(
      `SELECT * FROM users WHERE login=${login}";`
    );
    return data;
  }
}

module.exports = Usuario;


