
const { runQuery } = require("../data/bbdd-connector");

// Función para obtener un registro de sesión existente por su session_id
async function getSession(session_id) {
    const queryString = `SELECT * FROM session_logs WHERE session_id = ? LIMIT 1;`;
    const database = 'aplicaciones_web';
    const [rows, fields] = await runQuery(queryString, [session_id], database);
    return rows.length > 0 ? rows[0] : null;
}

// Función para actualizar un registro de sesión existente
async function updateSessionLog(session_id, end_Time) {
    const queryString = `UPDATE session_logs SET end_time = ? WHERE session_id = ?;`;
    const database = 'aplicaciones_web';
    await runQuery(queryString, [end_Time, session_id], database);
}

// Función para insertar un nuevo registro de sesión
async function insertSessionLog(session_id, user_id, start_time, application) {
    const end_time = '1999-01-01 00:00';
    const queryString = `INSERT INTO session_logs (session_id, idusers, start_time, end_time, aplicacion) VALUES (?, ?, ?, ?, ?);`;
    const database = 'aplicaciones_web';
    await runQuery(queryString, [session_id, user_id, start_time, end_time, application], database);
}

module.exports = { getSession, updateSessionLog, insertSessionLog };