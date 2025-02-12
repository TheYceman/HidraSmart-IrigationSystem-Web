function obtenerHoraActualEspania() {
    // Obtener la fecha y hora actual en España
    const now = new Date();
    const options = { timeZone: 'Europe/Madrid' };
    const nowSpainTime = now.toLocaleString('es-ES', options);

    // Dividir la cadena de fecha y hora en sus componentes
    const [fecha, hora] = nowSpainTime.split(", ");
    const [dia, mes, anio] = fecha.split("/");
    const [horas, minutos, segundos] = hora.split(":");
    
    // Formatear la fecha en el nuevo formato
    const nuevaFecha = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    
    // Formatear la hora en el nuevo formato
    const nuevaHora = `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}:${segundos}`;
    
    // Combinar la fecha y la hora en el nuevo formato
    const spainTime = `${nuevaFecha} ${nuevaHora}`;
    console.log(spainTime);
    return spainTime;
}

module.exports = { obtenerHoraActualEspania };