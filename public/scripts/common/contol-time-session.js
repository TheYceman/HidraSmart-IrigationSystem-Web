// Obtener la fecha y hora de inicio de sesión
let startTime = new Date();

// Función para comprobar el tiempo transcurrido y preguntar al usuario
function checkSessionTime() {
    // Obtener la fecha y hora actual
    let currentTime = new Date();

    // Calcular la diferencia en minutos entre la hora actual y la hora de inicio de sesión
    let elapsedTimeMinutes = Math.floor((currentTime - startTime) / (1000 * 60));

    // Si han pasado 30 minutos, preguntar al usuario si desea continuar
    if (elapsedTimeMinutes >= 30) {
        popupSessionClosed();
        
        // Reiniciar el tiempo de inicio de sesión
        startTime = new Date();
        
    }
}

// Llamar a la función cada minuto
setInterval(checkSessionTime, 60000); // 60000 milisegundos = 1 minuto
