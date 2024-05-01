
const { runQuery } = require("../data/bbdd-connector");
const { obtenerHoraActualEspania } = require("../utils/get-current-time-in-spain");

// Función para obtener un registro de sesión existente por su session_id
async function getSession(session_id) {
    const queryString = `SELECT * FROM session_logs WHERE session_id = ? LIMIT 1;`;
    const database = 'aplicaciones_web';
    const [rows, fields] = await runQuery(queryString, [session_id], database);
    return rows.length > 0 ? rows[0] : null;
}
// Función para actualizar un registro de sesión existente
async function updateSessionLog(session_id, end_time) {
    var actual_time = obtenerHoraActualEspania();
    const queryString = 'UPDATE session_logs SET end_time = "' + end_time + '" WHERE session_id = "' + session_id + '"';
    const database = 'aplicaciones_web';
    if(end_time === 'null'){
        end_time = actual_time;
    }
    await runQuery(queryString, [end_time, session_id], database);
}

// Función para insertar un nuevo registro de sesión
async function insertSessionLog(session_id, user_id, application) {
    var actual_time = obtenerHoraActualEspania();
    const end_time = '1999-01-01 00:00';
    const queryString = `INSERT INTO session_logs (session_id, idusers, start_time, end_time, aplicacion) VALUES (?, ?, ?, ?, ?);`;
    const database = 'aplicaciones_web';
    try {
        const result = await runQuery(queryString, [session_id, user_id, actual_time, end_time, application], database);
        if (result.success) {
            const rows = result.data.rows;
            return rows;
        } else {
            console.error('Error al ejecutar la consulta:', result.message);
            // Maneja el caso de error según sea necesario
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        // Maneja el error lanzado por la función runQuery
        throw error;
    }
}

module.exports = { getSession, updateSessionLog, insertSessionLog };