import React, { useEffect } from "react";

const GoogleApiKeyProvider = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    window.GOOGLE_MAPS_API_KEY = apiKey;

  }, []);

  return null;
};

export default GoogleApiKeyProvider;
