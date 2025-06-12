import React, { useEffect } from "react";

const GoogleApiKeyProvider = () => {
  useEffect(() => {
    // Obtener la API key de la variable de entorno en .env
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    window.VITE_GOOGLE_MAPS_API_KEY = apiKey;

  }, []);

  return null;
};

export default GoogleApiKeyProvider;
