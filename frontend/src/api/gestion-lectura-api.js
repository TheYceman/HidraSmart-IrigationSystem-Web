import axios from "axios";

export const fetchPeticiones = async (dbSuffix) => {
    try {
        const res = await axios.get(`/api/is-b${dbSuffix}/peticiones`);
        if (Array.isArray(res.data)) {
            return res.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al obtener peticiones:", error);
        return [];
    }
};

export const fetchLecturas = async (dbSuffix) => {
    try {
        const res = await axios.get(`/api/is-b${dbSuffix}/lecturas`);
        if (Array.isArray(res.data)) {
            return res.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al obtener lecturas:", error);
        return [];
    }
};