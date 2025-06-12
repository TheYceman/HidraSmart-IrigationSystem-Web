function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve) => {
    if (window.google) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => resolve();
  });
}

function initializeRiegoMap() {
  const apiKey = window.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error("No se encontró GOOGLE_MAPS_API_KEY en window");
    return;
  }

  const defaultLatitude = 38.266667;
  const defaultLongitude = -0.7;
  const defaultZoom = 14;

  loadGoogleMapsScript(apiKey).then(() => {
    const mapElement = document.getElementById("mapa-riego");
    if (!mapElement) {
      console.error("No se encontró el div con id 'mapa-riego'");
      return;
    }

    const map = new google.maps.Map(mapElement, {
      center: { lat: defaultLatitude, lng: defaultLongitude },
      zoom: defaultZoom,
      streetViewControl: false,
      mapTypeId: "terrain",
    });

    new google.maps.Marker({
      position: { lat: defaultLatitude, lng: defaultLongitude },
      map: map,
      title: "Centro de prueba",
    });
  });
}

// Ejecutamos directamente
initializeRiegoMap();
