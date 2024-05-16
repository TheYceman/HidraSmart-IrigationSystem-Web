const { runQuery } = require("../data/bbdd-connector");

class Elemento {

    constructor(Elemento) {
        this.identificador = Elemento.ideEle; //Identificador dentro del sistema A001
        this.sector = Elemento.ideSector; //Sector
        this.tipo = Elemento.tipo;//Tipo
        this.tramo = Elemento.ideTramo; //Tramo
        this.estado = Elemento.estado;//Estado
        this.observaciones = Elemento.Observaciones;//Marca
        this.historico = Elemento.Observaciones;//Marca
        this.tipo = Elemento.tipo;//Tipo
        this.titular = Elemento.ideTitular;//Titular
    }

    static async getPerPage(res, req, perPage, offset) {
        const queryString = "SELECT " +
            "ge_contadores.ideEle, " +
            "ge_contadores.ideSector, " +
            "ge_equipos.ideCont, " +
            "ge_contadores.ideTramo, " +
            "ge_equipos.modelo, " +
            "ge_equipos.dimension, " +
            "ge_equipos.Qnominal," +
            "ge_contadores.ideTitular, " +
            "ve.newEstado AS estado," +
            "ve.Observaciones AS Observaciones, " +
            "'contador' AS tipo " +
            "FROM " +
            "   aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "  aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "      ideElemento, " +
            "      MAX(instante) AS ultimaFecha, Observaciones " +
            "   FROM " +
            "      val_estados_equipos " +
            "   GROUP BY " +
            "      ideElemento, Observaciones) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
            "LEFT JOIN " +
            "    val_estados_equipos AS ve ON ultimos_estados.ideElemento = ve.ideElemento AND ultimos_estados.ultimaFecha = ve.instante " +
            "    LIMIT " + perPage + " OFFSET " + offset;
        const values = [];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const geContadores = results.data.rows.map((elemento) => new Elemento(elemento));
        console.log(geContadores);
        return geContadores;
    }

    static async getCountAll(res, req) {

        const queryString = "SELECT COUNT(*) AS total " +
            "FROM (" +
            "   SELECT " +
            "   ge_equipos.ideCont, " +
            "   ge_contadores.ideSector, " +
            "   ge_equipos.ideEle, " +
            "   ge_contadores.ideTramo, " +
            "   ge_equipos.modelo, " +
            "   ge_equipos.dimension, " +
            "   ge_equipos.Qnominal," +
            "   ge_contadores.ideTitular, " +
            "   'contador' AS tipo," +
            "   ve.newEstado AS ultimoEstado " +
            "   ve.Observaciones AS Observaciones, " +
            "FROM " +
            "    aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "    aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "       ideElemento, " +
            "      MAX(instante) AS ultimaFecha, Observaciones " +
            "  FROM " +
            "      val_estados_equipos " +
            "  GROUP BY " +
            "    ideElemento, Observaciones) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
            "LEFT JOIN " +
            "    val_estados_equipos AS ve ON ultimos_estados.ideElemento = ve.ideElemento AND ultimos_estados.ultimaFecha = ve.instante" +
            ") AS consulta_original;";
        const values = [];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const geTotal = results.data.rows.map((total) => total);
        console.log(geTotal[0].total);
        return geTotal[0].total;
    }

    static async getAllElementos(req, res) {

        const queryString = "SELECT " +
            "ge_contadores.ideEle, " +
            "ge_contadores.ideSector, " +
            "ge_equipos.ideCont, " +
            "ge_contadores.ideTramo, " +
            "ge_equipos.modelo, " +
            "ge_equipos.dimension, " +
            "ge_equipos.Qnominal," +
            "ge_contadores.ideTitular, " +
            "ve.newEstado AS estado," +
            "ve.Observaciones AS Observaciones, " +
            "'contador' AS tipo " +
            "FROM " +
            "   aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "  aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "      ideElemento, " +
            "      MAX(instante) AS ultimaFecha, Observaciones " +
            "   FROM " +
            "      val_estados_equipos " +
            "   GROUP BY " +
            "      ideElemento, Observaciones) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
            "LEFT JOIN " +
            "    val_estados_equipos AS ve ON ultimos_estados.ideElemento = ve.ideElemento AND ultimos_estados.ultimaFecha = ve.instante " +
            "    WHERE   ge_contadores.coorX <> '' AND ge_contadores.coorY <> ''";
        const values = [];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        console.log(queryString);
        const geContadores = results.data.rows.map((elemento) => new Elemento(elemento));

        return geContadores;
    }

    static async getFilteredData(res, req, sector) {
        const queryString = "SELECT " +
            "ge_contadores.ideEle, " +
            "ge_contadores.ideSector, " +
            "ge_equipos.ideCont, " +
            "ge_contadores.ideTramo, " +
            "ge_equipos.modelo, " +
            "ge_equipos.dimension, " +
            "ge_equipos.Qnominal, " +
            "ge_contadores.ideTitular, " +
            "ve.newEstado AS estado, " +
            "ve.Observaciones AS Observaciones, " +
            "'contador' AS tipo " +
            "FROM " +
            "   aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "  aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "      ideElemento, " +
            "      MAX(instante) AS ultimaFecha, Observaciones " +
            "   FROM " +
            "      val_estados_equipos " +
            "   GROUP BY " +
            "      ideElemento, Observaciones) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
            "LEFT JOIN " +
            "    val_estados_equipos AS ve ON ultimos_estados.ideElemento = ve.ideElemento AND ultimos_estados.ultimaFecha = ve.instante " +
            "    WHERE ideSector=?;";
        const values = [sector];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        return results.data.rows;
    }
}

module.exports = Elemento;
