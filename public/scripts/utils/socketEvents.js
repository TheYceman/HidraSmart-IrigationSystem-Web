const serverWithProtocol = window.location.origin;
const socket = io(serverWithProtocol, {
    reconnection: true,          // Habilitar reconexión automática
    reconnectionAttempts: 5,     // Número máximo de intentos de reconexión
    reconnectionDelay: 1000,     // Retraso inicial entre intentos de reconexión (en milisegundos)
    reconnectionDelayMax: 5000,  // Retraso máximo entre intentos de reconexión (en milisegundos)
});

socket.on("redirect", (path) => {
    window.location.href = path;
});

socket.on("connect", () => {
    console.log("Conectado al servidor");
});

socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconexión exitosa después del intento número ${attemptNumber}`);
});

socket.on("disconnect", (reason) => {
    console.log(`Desconectado del servidor. Razón: ${reason}`);
});
