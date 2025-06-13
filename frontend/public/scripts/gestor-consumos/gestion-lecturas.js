

function loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            resolve();
        };
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
}

function initializeRiegoMap() {
    // === CONFIGURACIÓN DE COORDENADAS ===

    const LOCATIONS = {
        ARGAMASILLA_ALBA: { lat: 39.133056, lng: -3.093611, zoom: 14 },
        DEFAULT: { lat: 38.266667, lng: -0.7, zoom: 14 }
    };

    // Cambia aquí la ubicación activa:
    const ACTIVE_LOCATION = LOCATIONS.ARGAMASILLA_ALBA;

    const apiKey = window.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error("No se encontró GOOGLE_MAPS_API_KEY en window");
        return;
    }

    loadGoogleMapsScript(apiKey).then(() => {
        const mapElement = document.getElementById("mapa-lecturas");
        if (!mapElement) {
            console.error("No se encontró el sitio para cargar el mapa");
            return;
        }

        const map = new google.maps.Map(mapElement, {
            center: { lat: ACTIVE_LOCATION.lat, lng: ACTIVE_LOCATION.lng },
            zoom: ACTIVE_LOCATION.zoom,
            streetViewControl: false,
            mapTypeId: "terrain",
        });

        new google.maps.Marker({
            position: { lat: ACTIVE_LOCATION.lat, lng: ACTIVE_LOCATION.lng },
            map: map,
            title: "Centro de prueba",
        });

    }).catch(err => {
        console.error("Error al cargar Google Maps: ", err);
    });
}

initializeRiegoMap();