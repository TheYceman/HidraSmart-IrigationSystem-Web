const { runQuery } = require("../data/bbdd-connector");

class Cliente {
  constructor(cliente) {
    this.numero = cliente.idcliente;
    this.nombre = cliente.nombre;
    this.dni = cliente.dni;
    this.telefono = cliente.telefono;
    this.email = cliente.email;
  }

  static async getAll() {

    const queryString = "SELECT * FROM clientes;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const cliente = results.data.rows.map((cliente) => new Cliente(cliente));
    return cliente;
  }

  static async getFilteredData(numero) {
    const queryString = `SELECT * FROM clientes WHERE idcliente=?;`;
    const values = [numero];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    console.log(
      `SELECT * FROM clientes WHERE idcliente="${numero}";`
    );
    return result.data.rows;;
  }

  static async getPerPage(perPage, offset) {

    const queryString = "SELECT * FROM clientes LIMIT " + perPage + " OFFSET " + offset;
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const clientes = results.data.rows.map((idcliente) => new Cliente(idcliente));
    return clientes;
  }

  static async getCountAll() {
    const queryString = "SELECT count(*) as total FROM clientes;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllClientes() {
    const queryString = "SELECT * FROM clientes;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const clientes = results.data.rows.map((idcliente) => new Cliente(idcliente));
    return clientes;
  }

  static async getFilteredData(idcliente) {
    const queryString = `SELECT * FROM clientes WHERE idcliente=?;`;
    const values = [idcliente];
    const database = 'aplicaciones_web';
    const result = await runQuery(queryString, values, database);
    return result.data.rows;;
  }
}

module.exports = Cliente;


