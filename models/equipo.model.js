const { runQuery } = require("../data/bbdd-connector");

class Equipo {

    constructor(equipo) {
        this.identificador = equipo.ideCont; //Identificador número de serie 11-06-10695
        this.sector = equipo.ideSector; //Sector
        this.ideElemento = equipo.ideEle;//Identificador dentro del sistema A001
        this.marca = equipo.marca;//Marca
        this.modelo = equipo.modelo;//Modelo
        this.dimension = equipo.dimension;//Dimension
        this.Qnominal = equipo.qNominal;//QNominal
        this.estado = equipo.estado;//Estado
        this.tipo = equipo.tipo;//Tipo
        this.titular = equipo.ideTitular;//Titular
    }

    static async getPerPage(res, req, perPage, offset) {
        const queryString = "SELECT " +
            "ge_contadores.ideEle, " +
            "ge_contadores.ideSector, " +
            "ge_equipos.ideCont, " +
            "ge_equipos.marca, " +
            "ge_equipos.modelo, " +
            "ge_equipos.dimension, " +
            "ge_equipos.Qnominal," +
            "ge_contadores.ideTitular, " +
            "ve.newEstado AS estado," +
            "'contador' AS tipo " +
            "FROM " +
            "   aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "  aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "      ideElemento, " +
            "      MAX(instante) AS ultimaFecha " +
            "   FROM " +
            "      val_estados_equipos " +
            "   GROUP BY " +
            "      ideElemento) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
            "LEFT JOIN " +
            "    val_estados_equipos AS ve ON ultimos_estados.ideElemento = ve.ideElemento AND ultimos_estados.ultimaFecha = ve.instante " +
            "    LIMIT " + perPage + " OFFSET " + offset;
        const values = [];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const geContadores = results.data.rows.map((equipo) => new Equipo(equipo));
        return geContadores;
    }

    static async getCountAll(res, req) {

        const queryString = "SELECT COUNT(*) AS total " +
            "FROM (" +
            "   SELECT " +
            "   ge_equipos.ideCont, " +
            "   ge_contadores.ideSector, " +
            "   ge_equipos.ideEle, " +
            "   ge_equipos.marca, " +
            "   ge_equipos.modelo, " +
            "   ge_equipos.dimension, " +
            "   ge_equipos.Qnominal," +
            "   ge_contadores.ideTitular, " +
            "   'contador' AS tipo," +
            "   ve.newEstado AS ultimoEstado " +
            "FROM " +
            "    aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "    aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "       ideElemento, " +
            "      MAX(instante) AS ultimaFecha " +
            "  FROM " +
            "      val_estados_equipos " +
            "  GROUP BY " +
            "    ideElemento) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
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

    static async getAllEquipos(req, res) {

        const queryString = "SELECT " +
            "ge_contadores.ideEle, " +
            "ge_contadores.ideSector, " +
            "ge_equipos.ideCont, " +
            "ge_equipos.marca, " +
            "ge_equipos.modelo, " +
            "ge_equipos.dimension, " +
            "ge_equipos.Qnominal," +
            "ge_contadores.ideTitular, " +
            "ve.newEstado AS estado," +
            "'contador' AS tipo " +
            "FROM " +
            "   aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "  aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "      ideElemento, " +
            "      MAX(instante) AS ultimaFecha " +
            "   FROM " +
            "      val_estados_equipos " +
            "   GROUP BY " +
            "      ideElemento) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
            "LEFT JOIN " +
            "    val_estados_equipos AS ve ON ultimos_estados.ideElemento = ve.ideElemento AND ultimos_estados.ultimaFecha = ve.instante " +
            "    WHERE   ge_contadores.coorX <> '' AND ge_contadores.coorY <> ''";
        const values = [];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        const geContadores = results.data.rows.map((equipo) => new Equipo(equipo));

        return geContadores;
    }

    static async getFilteredData(res, req, sector) {
        const queryString = "SELECT " +
            "ge_contadores.ideEle, " +
            "ge_contadores.ideSector, " +
            "ge_equipos.ideCont, " +
            "ge_equipos.marca, " +
            "ge_equipos.modelo, " +
            "ge_equipos.dimension, " +
            "ge_equipos.Qnominal, " +
            "ge_contadores.ideTitular, " +
            "ve.newEstado AS estado, " +
            "'contador' AS tipo " +
            "FROM " +
            "   aplicaciones_web.ge_equipos " +
            "INNER JOIN " +
            "  aplicaciones_web.ge_contadores ON ge_equipos.ideEle = ge_contadores.ideEle " +
            "LEFT JOIN " +
            "   (SELECT " +
            "      ideElemento, " +
            "      MAX(instante) AS ultimaFecha " +
            "   FROM " +
            "      val_estados_equipos " +
            "   GROUP BY " +
            "      ideElemento) AS ultimos_estados ON ge_equipos.ideEle = ultimos_estados.ideElemento " +
            "LEFT JOIN " +
            "    val_estados_equipos AS ve ON ultimos_estados.ideElemento = ve.ideElemento AND ultimos_estados.ultimaFecha = ve.instante " +
            "    WHERE ideSector=?;";
        const values = [sector];
        const database = 'aplicaciones_web';
        const results = await runQuery(queryString, values, database);
        return results.data.rows;
    }
}

module.exports = Equipo;
