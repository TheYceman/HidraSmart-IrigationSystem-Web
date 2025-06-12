import React, { useEffect } from "react";

const GoogleApiKeyProvider = () => {
  useEffect(() => {
    // Obtener la API key de la variable de entorno en .env
    // IMPORTANTE la variable debe empezar por VITE_
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // Asignar la API key a la variable global dentro de la ventana en la que se ejecute
    window.VITE_GOOGLE_MAPS_API_KEY = apiKey;

  }, []);

  return null;
};

export default GoogleApiKeyProvider;
