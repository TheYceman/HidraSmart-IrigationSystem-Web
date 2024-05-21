const { runQuery } = require("../data/bbdd-connector");
// Función para guardar una nueva sesión en la base de datos
function saveSession(req) {
    //console.log(req);   
    // Obtener el ID de sesión
    const sessionId = req.sessionID;

    // Obtener la fecha de expiración (expires)
    const expires = 0 //req.session.cookie.expires

    // Obtener los datos de la sesión (data)
    const sessionData = req.sessionStore.sessions[sessionId];

    if(sessionData){
        const queryString = `INSERT INTO sessions_manual (session_id, expires, data) VALUES ('${sessionId}', '${expires}', '${sessionData}');`;
        const values = [sessionId, expires, sessionData];
        const database = 'aplicaciones_web';
        runQuery(queryString, values, database);
    
    }

}

module.exports = saveSession;