function formatDateTimeForDB(date) {
    // Obtener los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const hours = String(date.getHours()).padStart(2, '0'); // Asegura que la hora tenga dos dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Asegura que los minutos tenga dos dígitos
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Asegura que los segundos tenga dos dígitos
    
    // Formatear la fecha y la hora en el formato 'YYYY-MM-DD HH:MM:SS'
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    return formattedDateTime;
}

module.exports = { formatDateTimeForDB };