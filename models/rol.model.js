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
    const data = await runQuery("SELECT * FROM grupos_usuario;");
    const rol = data.map((rol) => new Rol(rol));
    return rol;
  }

  static async getFilteredData(nombre) {
    const data = await runQuery(
      `SELECT * FROM grupos_usuario WHERE nombre="${nombre}";`
    );
    console.log(
      `SELECT * FROM grupos_usuario WHERE nombre="${nombre}";`
    );
    return data;
  }
  static async getFilteredDataGrupo(idGrupo) {
    const data = await runQuery(
      `SELECT * FROM grupos_usuario WHERE nombre="${idGrupo}";`
    );
    console.log(
      `SELECT * FROM grupos_usuario WHERE nombre="${idGrupo}";`
    );
    return data;
  }

  static async getPerPage(perPage, offset) {
    const data = await runQuery("SELECT * FROM grupos_usuario LIMIT " + perPage + " OFFSET " + offset + ";");
    const roles = data.map((rol) => new Rol(rol));
    return roles;
  }

  static async getCountAll() {
    const data = await runQuery("SELECT count(*) as total FROM grupos_usuario;");
    const geTotal = data.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllRoles() {
    const data = await runQuery("SELECT * FROM grupos_usuario;");
    const roles = data.map((rol) => new Rol(rol));
    return roles;
  }

  static async getFilteredData(nombre) {
    const data = await runQuery(
      `SELECT * FROM grupos_usuario WHERE nombre=${nombre}";`
    );
    return data;
  }
}

module.exports = Rol;


