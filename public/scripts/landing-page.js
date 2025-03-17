function getDeviceOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return 'android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 'ios';
    }

    return 'unknown';
  }

  // URLs de las tiendas
  const androidUrl = 'https://play.google.com/store/apps/details?id=com.hidralab.hidrasmart_irrigation_system&hl=es_419'; // Reemplazar con tu URL de Google Play
  const iosUrl = 'https://apps.apple.com/es/app/irrigation-system/id6742543776'; // Reemplazar con tu URL de App Store
  const unknownUrl = '/'; // Página 'Centro de Descargas' para dispositivos desconocidos

  function redirectToStore() {
    const os = getDeviceOS();
    if (os === 'android') {
      window.location.href = androidUrl;
    } else if (os === 'ios') {
      window.location.href = iosUrl;
    } else {
      window.location.href = unknownUrl;
    }
  }

  redirectToStore();