document.addEventListener('DOMContentLoaded', function() {
    const containerProfile = document.getElementById('container-profile');
    const buttonLogOut = document.getElementById('button-log-out');

    // Agregar evento clic al botón de log out
    buttonLogOut.addEventListener('click', function(event) {
        event.stopPropagation(); // Evitar que el evento se propague al hacer clic en el botón
        containerProfile.classList.toggle('active'); // Alternar clase activa
    });

    // Agregar evento clic al documento para desactivar el contenedor si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (!containerProfile.contains(event.target) && !buttonLogOut.contains(event.target)) {
            containerProfile.classList.remove('active');
        }
    });

    const logoutButton = document.getElementById("profile-head-right");

    logoutButton.addEventListener("click", function(event) {
        popupSessionClosed();
    });
});