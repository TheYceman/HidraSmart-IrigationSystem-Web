const socketIO = require("socket.io");
const { updateSessionLog } = require('../controllers/session.controller');
const { formatDateTimeForDB } = require("../utils/format-date-time-db");

function configureSocket(server) {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log("Conexión de Socket.IO recibida.",  socket.id); // Mensaje de conexión aceptada
    // Acceso a la sesión del usuario
    const username = (socket.request.session?.user?.[0]?.name) || "Usuario Desconocido";
    

    // Verificar si el usuario está autenticado
    if (username === "Usuario Desconocido") {
        // Redirigir al usuario a la página principal si no está autenticado
        socket.emit("redirect", "/"); // Emitir un evento "redirect" al cliente
        return; // Detener la ejecución del código restante dentro de este evento
    }else{
        console.log(`El usuario: ${username}, con sessionId: ${socket.request.session.token} se ha conectado.`);  
        const end_time = '1999-01-01 00:00';  
        updateSessionLog(socket.request.session.token, end_time);
    }

    socket.on("disconnect", () => {
        // Manejar la desconexión del cliente
        console.log(`El usuario: ${username}, con sessionId: ${socket.request.session.token} se ha desconectado`);
        // Obtener la hora actual
        const startCurrentTime = new Date();
        const endTime = formatDateTimeForDB(startCurrentTime);
        updateSessionLog(socket.request.session.token, endTime);
    });

    // socket.on("reconnect", (attemptNumber) => {
    //     // Manejar la reconexión del cliente
    //     console.log(`Reconexión exitosa después del intento número ${attemptNumber}`);
    //     // Realizar operaciones de reconexión necesarias, como volver a autenticar al cliente
    // });

  });

  return io;
}

module.exports = configureSocket;
