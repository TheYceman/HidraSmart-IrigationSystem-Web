const { Op } = require('sequelize');
const { getSequelizeInstance } = require('../data/bbdd-selector');
const { Lectura } = require('../models/lectura.model');

const modelCache = {};

function transformarLecturasConImagen(lecturas) {
    return lecturas.map(l => {
        let imagenBase64 = null;
        if (l.imagen) {
            try {
                const buffer = Buffer.from(l.imagen);
                // Verificar si el buffer contiene un prefijo data:image
                const bufferString = buffer.toString('utf8');
                if (bufferString.startsWith("data:image")) {
                    imagenBase64 = bufferString.split(',')[1];
                } else {
                    imagenBase64 = buffer.toString('base64');
                }
            } catch (error) {
                console.error("Error al transformar la imagen a base64:", error);
            }
        }
        return {
            ...l.dataValues,
            imagen: imagenBase64 ? `data:image/jpeg;base64,${imagenBase64}` : null
        };
    });
}

async function getAwLecturas(database) {
    if (!modelCache[database]) {
        const sequelize = await getSequelizeInstance(database);
        const AwLecturas = Lectura(sequelize);
        modelCache[database] = AwLecturas;
    }
    return modelCache[database];
}

async function getAll(databaseNumber, filtroFecha = null) {
    const AwLecturas = await getAwLecturas(databaseNumber);

    const whereClause = filtroFecha
        ? {
            fecha: {
                [Op.gte]: new Date(`${filtroFecha}T00:00:00`),
                [Op.lt]: new Date(`${filtroFecha}T23:59:59`)
            }
        }
        : {};

    const lecturas = await AwLecturas.findAll({ where: whereClause });
    return transformarLecturasConImagen(lecturas);
}

async function getByContador(databaseNumber, contador, filtroFecha = null) {
    const AwLecturas = await getAwLecturas(databaseNumber);

    const whereClause = {
        contador: contador
    };

    if (filtroFecha) {
        whereClause.fecha = {
            [Op.gte]: new Date(`${filtroFecha}T00:00:00`),
            [Op.lt]: new Date(`${filtroFecha}T23:59:59`)
        };
    }

    const lecturas = await AwLecturas.findAll({ where: whereClause });
    return transformarLecturasConImagen(lecturas);
}

async function createLectura(databaseNumber, data) {
    const AwLecturas = await getAwLecturas(databaseNumber);

    let imagenBuffer = null;
    if (data.imagen && data.imagen.startsWith("data:image")) {
        // Extraer la parte base64 pura
        const base64Data = data.imagen.split(',')[1];
        if (!base64Data) {
            console.error("Error: No se encontró contenido base64 válido en la imagen");
            throw new Error("Formato de imagen inválido");
        }
        try {
            imagenBuffer = Buffer.from(base64Data, 'base64');
        } catch (error) {
            console.error("Error al convertir base64 a buffer:", error);
            throw new Error("No se pudo procesar la imagen");
        }
    }

    const nuevaLectura = await AwLecturas.create({
        contador: data.contador,
        fecha: data.fecha,
        usuario: data.usuario,
        volumen: data.volumen,
        imagen: imagenBuffer
    });

    return nuevaLectura;
}

async function updateLectura(databaseNumber, idLectura, nuevosDatos) {
    const AwLecturas = await getAwLecturas(databaseNumber);

    const lectura = await AwLecturas.findByPk(idLectura);
    if (!lectura) throw new Error("Lectura no encontrada");

    if (nuevosDatos.imagen?.startsWith("data:image")) {
        const base64Data = nuevosDatos.imagen.split(',')[1];
        nuevosDatos.imagen = Buffer.from(base64Data, 'base64');
    } else if (nuevosDatos.imagen === null) {
        nuevosDatos.imagen = null;
    }

    await lectura.update(nuevosDatos);
    return lectura;
}

module.exports = {
    getAll,
    getByContador,
    createLectura,
    updateLectura,
};
