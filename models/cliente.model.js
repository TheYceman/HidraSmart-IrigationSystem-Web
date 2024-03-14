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
    const data = await runQuery("SELECT * FROM clientes;");
    const cliente = data.map((cliente) => new Cliente(cliente));
    return cliente;
  }

  static async getFilteredData(numero) {
    const data = await runQuery(
      `SELECT * FROM clientes WHERE idcliente="${numero}";`
    );
    console.log(
      `SELECT * FROM clientes WHERE idcliente="${numero}";`
    );
    return data;
  }

  static async getPerPage(perPage, offset) {
    const data = await runQuery("SELECT * FROM clientes LIMIT " + perPage + " OFFSET " + offset + ";");
    const clientes = data.map((idcliente) => new Cliente(idcliente));
    return clientes;
  }

  static async getCountAll() {
    const data = await runQuery("SELECT count(*) as total FROM clientes;");
    const geTotal = data.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllClientes() {
    const data = await runQuery("SELECT * FROM clientes;");
    const clientes = data.map((idcliente) => new Cliente(idcliente));
    return clientes;
  }

  static async getFilteredData(idcliente) {
    const data = await runQuery(
      `SELECT * FROM clientes WHERE idcliente=${idcliente}";`
    );
    return data;
  }
}

module.exports = Cliente;


