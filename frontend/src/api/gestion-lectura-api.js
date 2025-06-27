import axios from "axios";

/**
 * Fetchs all peticiones from the backend for the given database suffix
 * and returns them as an array. If there is an error, it logs the error
 * and returns an empty array.
 *
 * @param {string} dbSuffix - suffix of the database to fetch from
 * @returns {Promise<Array>} - an array of peticiones
 */
export const fetchPeticiones = async (dbSuffix, fecha) => {
    try {
        let url = dbSuffix === "all"
            ? "/api/peticiones-todas"
            : `/api/is-b${dbSuffix}/peticiones`;

        if (fecha) url += `?fecha=${fecha}`;
        const res = await axios.get(url);
        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error("Error al obtener peticiones:", error);
        return [];
    }
};

/**
 * Obtiene la descripción del tipo de petición dado su idtipo y base de datos
 * @param {string|number} dbSuffix - sufijo de base de datos, por ejemplo 'bx' (sin 'is-')
 * @param {number|string} idtipo
 * @returns {Promise<string|null>}
 */
export const fetchNombreTipoPeticion = async (dbSuffix, idtipo) => {
    try {
        const res = await axios.get(`/api/is-b${dbSuffix}/peticion/nombre/${idtipo}`);
        return res.data;
    } catch (error) {
        console.error("❌ Error al obtener tipo de petición:", error);
        return null;
    }
};

export const fetchLecturas = async (dbSuffix, fecha) => {
    try {
        let url = dbSuffix === "all"
            ? "/api/lecturas-todas"
            : `/api/is-b${dbSuffix}/lecturas`;

        if (fecha) url += `?fecha=${fecha}`;
        const res = await axios.get(url);
        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error("Error al obtener lecturas:", error);
        return [];
    }
};

/**
 * Fetches lecturas from the backend for a specific contador and database suffix.
 * Returns them as an array. If there is an error, it logs the error and
 * returns an empty array.
 *
 * @param {string} dbSuffix - suffix of the database to fetch from
 * @param {string} contador - identifier of the contador to fetch lecturas for
 * @returns {Promise<Array>} - an array of lecturas
 */

export const fetchLecturasByContador = async (dbSuffix, contador, fecha = null) => {
    try {
        let url =
            dbSuffix === "all"
                ? `/api/lecturas-todas/cont-${contador}`
                : `/api/is-b${dbSuffix}/lecturas/cont-${contador}`;

        if (fecha) {
            url += `?fecha=${fecha}`;
        }

        const res = await axios.get(url);

        if (Array.isArray(res.data)) {
            return res.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("❌ Error al obtener lecturas por contador:", error);
        return [];
    }
};

/**
 * Fetches all contadores from the backend for a specific database suffix.
 * Returns them as an array. If there is an error, it logs the error and
 * returns an empty array.
 *
 * @param {string} dbSuffix - suffix of the database to fetch from
 * @returns {Promise<Array>} - an array of contadores
 */
export const fetchContadores = async (dbSuffix) => {
    try {
        const url =
            dbSuffix === "all"
                ? "/api/contadores-todos"
                : `/api/is-b${dbSuffix}/contadores`;

        const res = await axios.get(url);

        if (Array.isArray(res.data)) {
            return res.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al obtener contadores:", error);
        return [];
    }
};

/**
 * Fetches all available balsas from the backend.
 * Returns them as an array of strings. If there is an error, it logs the error and
 * returns an empty array.
 *
 * @returns {Promise<Array>} - an array of balsas, e.g. ['x', '1', '2', ...]
 */
export const fetchBalsasDisponibles = async () => {
    try {
        // Animacion de carga hasta que se obtengan las balsas
        const res = await axios.get(`/api/balsas-disponibles`);
        return res.data; // ['x', '1', '2', ...]
    } catch (error) {
        console.error("Error al obtener balsas disponibles:", error);
        return [];
    }
};

export const fetchNombreUsuario = async (id_usuario) => {
    try {
        const res = await axios.get(`/api/usuario/name-${id_usuario}`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener el nombre de usuario:", error);
        return null;
    }
};

export const fetchUsuarios = async () => {
    try {
        const res = await axios.get(`/api/usuarios`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        return [];
    }
};
