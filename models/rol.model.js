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
  }

  static async getAll() {
    const queryString = "SELECT * FROM grupos_usuario;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const rol = results.data.rows.map((rol) => new Rol(rol));
    return rol;
  }

  static async getFilteredData(nombre) {

    const queryString = `SELECT * FROM grupos_usuario WHERE nombre=?;`;
    const values = [nombre];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM grupos_usuario WHERE nombre="${nombre}";`
    );
    return data;
  }
  static async getFilteredDataGrupo(idGrupo) {
    const queryString = `SELECT * FROM grupos_usuario WHERE nombre=?;`;
    const values = [idGrupo];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM grupos_usuario WHERE nombre="${idGrupo}";`
    );
    return result.data.rows;;
  }

  static async getPerPage(perPage, offset) {

    const queryString = "SELECT * FROM grupos_usuario LIMIT " + perPage + " OFFSET " + offset;
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const roles = results.data.rows.map((rol) => new Rol(rol));
    return roles;
  }

  static async getCountAll() {

    const queryString = "SELECT count(*) as total FROM grupos_usuario;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllRoles() {
    const queryString = "SELECT * FROM grupos_usuario;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const roles = results.data.rows.map((rol) => new Rol(rol));
    return roles;
  }

  static async getFilteredData(nombre) {
    const queryString = `SELECT * FROM grupos_usuario WHERE nombre=?";`;
    const values = [nombre];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Rol;


