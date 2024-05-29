const { runQuery } = require("../data/bbdd-connector");

class Cultivo {
    constructor(cultivo) {
        this.idParcela = cultivo.idParcela;
        this.cultivo = cultivo.cultivo;
        this.fechaHora = cultivo.fechayhora;
    }

    static async getAllCultivos(res, req) {
        const queryString = "SELECT * FROM dat_cultivos;";
        const values = [];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const cultivos = results.data.rows.map((cultivo) => new Cultivo(cultivo));
        return cultivos;
    }

    static async getCultivosByParcela(res, req, idParcela) {
        const queryString = "SELECT * FROM dat_cultivos WHERE idParcela = ?;";
        const values = [idParcela];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const cultivos = results.data.rows.map((cultivo) => new Cultivo(cultivo));
        return cultivos;
    }

    static async getCultivosByMonth(res, req, month) {
        const queryString = "SELECT * FROM dat_cultivos WHERE MONTH(fechayhora) = ?;";
        const values = [month];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const cultivos = results.data.rows.map((cultivo) => new Cultivo(cultivo));
        return cultivos;
    }

    static async insertCultivo(res, req, idParcela, cultivo, fechaHora) {
        const queryString = "INSERT INTO dat_cultivos (idParcela, cultivo, fechayhora) VALUES (?, ?, ?);";
        const values = [idParcela, cultivo, fechaHora];
        const database = 'aplicaciones_web';
        await runQuery(queryString, values, database);
    }
    static async getTotalPagesCultivo(req, res) {
        let pages = 1;
        const itemsPerPage = 10;
        const number_registers = await Cultivo.getCountAll(req, res);

        if (number_registers > 0) {
            pages = Math.ceil(number_registers / itemsPerPage);
        }

        return pages;
    }

    static async getGeDataCultivoPerPage(req, res) {
        const page = parseInt(req.query.page) || 1; // Página actual
        const itemsPerPage = 10; // Cantidad de elementos por página
        const offset = (page - 1) * itemsPerPage;
        const geData = [...(await Cultivo.getPerPage(req, res, itemsPerPage, offset))];
        return geData;
    }

    static async getDataCultivo(req, res) {
        const params = req.query;
        const geData = await Cultivo.getCultivosByParcela(req, res, params.idParcela);
        return geData;
    }

    static async getFilteredData(res, req, idParcela) {
        const queryString =  `SELECT * FROM dat_cultivos WHERE idParcela=?;`;
        const values = [idParcela];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        return results.data.rows;
      }

      static async getCountAll(res, req) {

        const queryString = "SELECT count(*) as total FROM dat_cultivos;";
        const values = [];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const geTotal = results.data.rows.map((total) => total);
        console.log(geTotal[0].total);
        return geTotal[0].total;
      }

      
  static async getPerPage(res, req, perPage, offset) {

    const queryString = "SELECT * FROM dat_cultivos LIMIT " + perPage + " OFFSET " + offset;
    const values = [];
    const database = 'aplicaciones_web';
    const results = await runQuery(queryString, values, database);
    const geContadores = results.data.rows.map((cultivos) => new Cultivo(cultivos));
    return geContadores;
  }
}

module.exports = Cultivo;
