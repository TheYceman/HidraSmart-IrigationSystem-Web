
const SessionLog = require('../models/session-logs.model');
const { obtenerHoraActualEspania } = require("../utils/get-current-time-in-spain");

// Función para obtener un registro de sesión existente por su session_id
async function getSession(session_id) {
    try {
        const session = await SessionLog.findOne({
            where: { session_id },
        });

        return session ? session.get({ plain: true }) : null;
    } catch (error) {
        console.error('Error al obtener la sesión:', error);
        throw new Error('Error al obtener la sesión.');
    }
}

// Función para actualizar un registro de sesión existente
async function updateSessionLog(session_id, end_time) {
    // const actual_time = obtenerHoraActualEspania();

    try {
        const result = await SessionLog.update(
            { end_time: end_time },
            { where: { session_id: session_id } }
        );

        if (result[0] === 0) {
            console.error(`No se encontró el registro con session_id ${session_id}`);
        }
    } catch (error) {
        console.error('Error al actualizar el registro de sesión:', error);
        throw error;
    }
}

// Función para insertar un nuevo registro de sesión
async function insertSessionLog(session_id, user_id) {
    const actual_time = obtenerHoraActualEspania();
    const end_time = '1999-01-01 00:00';
    const device = "web_react";
    try {
        await SessionLog.create({
            session_id: session_id,
            idusers: user_id,
            start_time: actual_time,
            end_time: end_time,
            device: device,
            environment: process.env.NODE_ENV
        });
    } catch (error) {
        console.error('Error al insertar el registro de sesión:', error);
        throw error;
    }
}

module.exports = { getSession, updateSessionLog, insertSessionLog };