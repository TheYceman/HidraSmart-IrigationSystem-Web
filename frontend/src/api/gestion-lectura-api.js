import axios from "axios";

export const fetchPeticiones = async (database, fecha) => {
    try {
        let url = database === "all"
            ? "/api/peticiones-todas"
            : `/api/${database}/peticiones`;

        if (fecha) url += `?fecha=${fecha}`;
        const res = await axios.get(url);
        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error("Error al obtener peticiones:", error);
        return [];
    }
};

export const fetchTiposPeticiones = async (database) => {
    try {
        const res = await axios.get(`/api/${database}/peticiones/tipos`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener los tipos de peticiones:", error);
        return [];
    }
};

export const fetchLecturas = async (database, fecha) => {
    try {
        let url = database === "all"
            ? "/api/lecturas-todas"
            : `/api/${database}/lecturas`;

        if (fecha) url += `?fecha=${fecha}`;
        const res = await axios.get(url);
        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error("Error al obtener lecturas:", error);
        return [];
    }
};

export const fetchLecturasByContador = async (database, contador, fecha = null) => {
    try {
        let url =
            database === "all"
                ? `/api/lecturas-todas/cont-${contador}`
                : `/api/${database}/lecturas/cont-${contador}`;

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
        console.error("Error al obtener lecturas por contador:", error);
        return [];
    }
};

export const fetchContadores = async (database) => {
    try {
        const url =
            database === "all"
                ? "/api/contadores-todos"
                : `/api/${database}/contadores`;

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

export const fetchBalsasDisponibles = async () => {
    try {
        // Animacion de carga hasta que se obtengan las balsas
        const res = await axios.get(`/api/balsas-disponibles`);
        
        return res.data; // [{ id: 1, nombre: 'hidrasmart_is_b1' }]
    } catch (error) {
        console.error("Error al obtener balsas disponibles:", error);
        return [];
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
