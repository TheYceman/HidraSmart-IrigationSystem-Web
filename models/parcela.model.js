const { runQuery } = require("../data/bbdd-connector");

class Parcela {
  constructor(parcela) {
    this.id = parcela.ideParcela;
    this.sector = parcela.ideSector;
    this.titular = parcela.ideTitular;
    this.municipio = parcela.municipio;
    this.poligono = parcela.poligono;
    this.parcela = parcela.parcela;
    this.paraje = parcela.paraje;
    this.dimension = parcela.dimension;
    this.cultivo = parcela.tipoCultivo;
    this.riego = parcela.tipoRiego;
    this.propietario = parcela.propietario;
    this.hectareas = parcela.hectareas;
   
  }

  static async getPerPage(res, req, perPage, offset) {

    const queryString = "SELECT * FROM ge_parcelas LIMIT " + perPage + " OFFSET " + offset;
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geContadores = results.data.rows.map((parcela) => new Parcela(parcela));
    return geContadores;
  }

  static async getCountAll(res, req) {

    const queryString = "SELECT count(*) as total FROM ge_parcelas;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geTotal = results.data.rows.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAllParcelas(res, req) {

    const queryString = "SELECT * FROM ge_parcelas;";
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geParcelas = results.data.rows.map((parcela) => new Parcela(parcela));
    //console.log(geParcelas);
    return geParcelas;
  }

  static async getFilteredData(res, req, sector) {
    const queryString =  `SELECT * FROM ge_parcelas WHERE ideParcela=?;`;
    const values = [sector];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    return results.data.rows;
  }
}

module.exports = Parcela;
