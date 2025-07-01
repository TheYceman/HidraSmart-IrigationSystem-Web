async function loading_start() {
    return new Promise((resolve) => {
        // Simula una operación asíncrona que tarda 1 segundo
        // setTimeout(() => {
            var loadingContainer = document.getElementById('loading-container');
            // Mostar el gif de carga y ocultar el contenido
            loadingContainer.style.display = 'flex';
            resolve();
        // }, 1000);
    });
};

async function loading_end() {
    return new Promise((resolve) => {
        // Simula una operación asíncrona que tarda 1 segundo
        setTimeout(() => {
            var loadingContainer = document.getElementById('loading-container');
            // Ocultar el gif de carga y mostrar el contenido
            loadingContainer.style.display = 'none';
            var loadingTitle = document.getElementById('loading_title');
            loadingTitle.innerHTML = '';
            resolve();
        }, 1000);
    });
};