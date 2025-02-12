const { runQuery } = require("../data/bbdd-connector");

class Peticion {
  constructor(peticion) {
    this.idPeticion = peticion.idPeticion;
    this.nombre = peticion.name;
    this.imagen = peticion.image;
    this.requeridaPor = peticion.requester;
    this.asignadaa = peticion.assignedTo;
    this.asignadaId = peticion.assignedId;
    this.prioridad = peticion.priority;
    this.estado = peticion.status;
    this.tipo = peticion.type;
    this.comentarios = peticion.comments;
    
  }

  static async getAll() {

    const queryString = "SELECT p.idPeticion, tp.descripcion AS type, u1.username AS requester, p.status, p.comments, u2.username AS assignedTo, p.priority, p.name, p.image, u2.Idusers AS assignedId FROM aplicaciones_web.ge_peticiones p "+
    "JOIN users u1 ON p.requester = u1.idusers "+ 
    "JOIN users u2 ON p.assignedTo = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.type = tp.idtipo;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const peticion = results.data.rows.map((peticion) => new Peticion(peticion));
    return peticion;
  }

  static async getFilteredData(numero) {
    const queryString = "SELECT p.idPeticion, tp.descripcion AS type, u1.username AS requester, p.status, p.comments, u2.username AS assignedTo, p.priority, p.name, p.image, u2.Idusers AS assignedId FROM aplicaciones_web.ge_peticiones p "+
    "JOIN users u1 ON p.requester = u1.idusers "+ 
    "JOIN users u2 ON p.assignedTo = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.type = tp.idtipo WHERE idPeticion=?;";
    const values = [numero];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }

  static async getPerPage(perPage, offset) {

    const queryString = "SELECT p.idPeticion, tp.descripcion AS type, u1.username AS requester, p.status, p.comments, u2.username AS assignedTo, p.priority, p.name, p.image, u2.Idusers AS assignedId FROM aplicaciones_web.ge_peticiones p "+
    "JOIN users u1 ON p.requester = u1.idusers "+ 
    "JOIN users u2 ON p.assignedTo = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.type = tp.idtipo LIMIT " + perPage + " OFFSET " + offset;

    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const peticiones = results.data.rows.map((idPeticion) => new Peticion(idPeticion));
    return peticiones;
  }

  static async getCountAll() {
    const queryString = "SELECT count(*) as total FROM ge_peticiones;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }


  static async getCountPendientes() {
    const queryString = "SELECT count(*) as total FROM ge_peticiones where status='Pendiente';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getCountAsignadasAMi(req,res) {
    const queryString = "SELECT count(*) as total FROM ge_peticiones where assignedTo="+ req.session.user[0].idusers+" and status<>'Pendiente';";
    console.log(queryString);
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getCountAprobadas() {
    const queryString = "SELECT count(*) as total FROM ge_peticiones where status='Aprobada';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getCountAsignadas() {
    const queryString = "SELECT count(*) as total FROM ge_peticiones where status='Asignada';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getCountRechazadas() {
    const queryString = "SELECT count(*) as total FROM ge_peticiones where status='Rechazada';";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }
 

  static async getAllPeticiones() {
    const queryString = "SELECT p.idPeticion, tp.descripcion AS type, u1.username AS requester, p.status, p.comments, u2.username AS assignedTo, p.priority, p.name, p.image, u2.Idusers AS assignedId FROM aplicaciones_web.ge_peticiones p "+
    "JOIN users u1 ON p.requester = u1.idusers "+ 
    "JOIN users u2 ON p.assignedTo = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.type = tp.idtipo;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const peticiones = results.data.rows.map((idPeticion) => new Peticion(idPeticion));
    return peticiones;
  }

  static async getFilteredData(idPeticion) {
    const queryString = "SELECT p.idPeticion, tp.descripcion AS type, u1.username AS requester, p.status, p.comments, u2.username AS assignedTo, p.priority, p.name, u2.Idusers AS assignedId FROM aplicaciones_web.ge_peticiones p "+
    "JOIN users u1 ON p.requester = u1.idusers "+ 
    "JOIN users u2 ON p.assignedTo = u2.idusers "+
    "JOIN tipo_peticiones tp ON p.type = tp.idtipo WHERE idPeticion=?;";
    const values = [idPeticion];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Peticion;


