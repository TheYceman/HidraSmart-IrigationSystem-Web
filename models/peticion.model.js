const { runQuery } = require("../data/bbdd-connector");

class Peticion {
  constructor(peticion) {
    this.idPeticion = peticion.idPeticion;
    this.tipo = peticion.tipo;
    this.usuario = peticion.usuario;
    this.estado = peticion.estado;
    this.comentarios = peticion.comentarios;
    this.asignadaa = peticion.asignadaa;
  }

  static async getAll() {

    const queryString = "SELECT p.idPeticion, tp.descripcion AS tipo, u1.username AS usuario, p.estado, p.comentarios, u2.username AS asignadaa FROM aplicaciones_web.peticiones p "+
    "JOIN users u1 ON p.usuario = u1.idusers "+ 
    "JOIN users u2 ON p.asignadaa = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.tipo = tp.idtipo;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const peticion = results.data.rows.map((peticion) => new Peticion(peticion));
    return peticion;
  }

  static async getFilteredData(numero) {
    const queryString = "SELECT p.idPeticion, tp.descripcion AS tipo, u1.username AS usuario,  p.estado, p.comentarios, u2.username AS asignadaa FROM aplicaciones_web.peticiones p "+
    "JOIN users u1 ON p.usuario = u1.idusers "+ 
    "JOIN users u2 ON p.asignadaa = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.tipo = tp.idtipo WHERE idPeticion=?;";
    const values = [numero];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      "SELECT p.idPeticion, tp.descripcion AS tipo, u1.username AS usuario, p.estado, p.comentarios, u2.username AS asignadaa FROM aplicaciones_web.peticiones p "+
      "JOIN users u1 ON p.usuario = u1.idusers "+ 
      "JOIN users u2 ON p.asignadaa = u2.idusers "+
      "JOIN tipo_peticiones tp ON p.tipo = tp.idtipo idPeticion="+numero+";"
    );
    return result.data.rows;;
  }

  static async getPerPage(perPage, offset) {

    const queryString = "SELECT p.idPeticion, tp.descripcion AS tipo, u1.username AS usuario, p.estado, p.comentarios, u2.username AS asignadaa FROM aplicaciones_web.peticiones p "+
    "JOIN users u1 ON p.usuario = u1.idusers "+ 
    "JOIN users u2 ON p.asignadaa = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.tipo = tp.idtipo LIMIT " + perPage + " OFFSET " + offset;

    console.log(queryString);

    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const peticiones = results.data.rows.map((idPeticion) => new Peticion(idPeticion));
    return peticiones;
  }

  static async getCountAll() {
    const queryString = "SELECT count(*) as total FROM peticiones;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllPeticiones() {
    const queryString = "SELECT p.idPeticion, tp.descripcion AS tipo, u1.username AS usuario, p.estado, p.comentarios, u2.username AS asignadaa FROM aplicaciones_web.peticiones p "+
    "JOIN users u1 ON p.usuario = u1.idusers "+ 
    "JOIN users u2 ON p.asignadaa = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.tipo = tp.idtipo;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const peticiones = results.data.rows.map((idPeticion) => new Peticion(idPeticion));
    return peticiones;
  }

  static async getFilteredData(idPeticion) {
    const queryString = "SELECT p.idPeticion, tp.descripcion AS tipo, u1.username AS usuario, p.estado, p.comentarios, u2.username AS asignadaa FROM aplicaciones_web.peticiones p "+
    "JOIN users u1 ON p.usuario = u1.idusers "+ 
    "JOIN users u2 ON p.asignadaa = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.tipo = tp.idtipo WHERE idPeticion=?;";
    const values = [idPeticion];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Peticion;


