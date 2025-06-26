import { useState, useEffect } from 'react';
import '../../../public/styles/pop-up/PopupConfiguration.css';
import { handleSwitch2FA } from '../../../public/scripts/switch-2FA';

const Switch2FA = ({ popupData, fadeMixinNotTime, on2FAChange }) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(popupData?.two_factor_enabled ?? false);
  const [tempIs2FAEnabled, setTempIs2FAEnabled] = useState(popupData?.two_factor_enabled ?? false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualizar estados cuando cambie popupData
  useEffect(() => {
    const enabled = popupData?.two_factor_enabled ?? false;
    setIs2FAEnabled(enabled);
    setTempIs2FAEnabled(enabled);
  }, [popupData?.two_factor_enabled]);

  // Verificar si el estado ha cambiado
  const hasStateChanged = tempIs2FAEnabled;
  console.log("NUEVO ESTADO: ", hasStateChanged);
  // Imprimir estado del botón por consola
  useEffect(() => {
    const isButtonDisabled = isLoading || !hasStateChanged;
    console.log('Estado del botón:', isButtonDisabled ? 'DESACTIVADO' : 'ACTIVADO');
    console.log('Razón:', {
      isLoading: isLoading,
      hasStateChanged: hasStateChanged,
      currentState: is2FAEnabled,
      tempState: tempIs2FAEnabled
    });
  }, [isLoading, hasStateChanged, is2FAEnabled, tempIs2FAEnabled]);

  const handleSwitchToggle = (event) => {
    setTempIs2FAEnabled(event.target.checked);
  };

  const handleConfirm = async () => {
    if (!hasStateChanged) return;

    setIsLoading(true);
    setError(null);
    try {
      const success = await handleSwitch2FA(
        fadeMixinNotTime,
        is2FAEnabled, // Estado actual (antes del cambio)
        popupData?.email
      );
      if (success) {
        // Actualizar el estado real solo si la operación fue exitosa
        setIs2FAEnabled(tempIs2FAEnabled);
        on2FAChange();
      } else {
        // Si falla, revertir el estado temporal al estado real
        setTempIs2FAEnabled(is2FAEnabled);
      }
    } catch (err) {
      setError(err.message);
      // Si hay error, revertir el estado temporal al estado real
      setTempIs2FAEnabled(is2FAEnabled);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tab_content_popup_configuration">
      <div id="container-switcher-2fa" className="container_switcher">
        <div className="slideCol_state">
          <div className="scroller_state">
            <div id="inner-element-state-2fa" className="inner_state">
              <p>{tempIs2FAEnabled ? 'Activada' : 'Desactivada'}</p>
            </div>
          </div>
        </div>
        <div id="2fa-state" className="checkbox">
          <label className="checkbox__container" htmlFor="input-2fa-state">
            <input
              id="input-2fa-state"
              className="checkbox__toggle"
              type="checkbox"
              checked={tempIs2FAEnabled}
              onChange={handleSwitchToggle}
              disabled={isLoading}
              aria-label="Toggle Two-Factor Authentication"
            />
            <span className="checkbox__checker" />
            <span className="checkbox__cross" />
            <span className="checkbox__ok" />
            <svg
              id="svg-2fa-state"
              className="checkbox__bg"
              viewBox="0 0 110 43.76"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                className="shape"
                d="M88.256,43.76c12.188,0,21.88-9.796,21.88-21.88S100.247,0,88.256,0c-15.745,0-20.67,12.281-33.257,12.281,S38.16,0,21.731,0C9.622,0-0.149,9.796-0.149,21.88s9.672,21.88,21.88,21.88c17.519,0,20.67-13.384,33.263-13.384,S72.784,43.76,88.256,43.76z"
              />
            </svg>
          </label>
        </div>
      </div>
      <div id="container-common" className="container_common">
        {error && <p className="error-message" role="alert">{error}</p>}
        <button
          id="button-change-2fa"
          className="button_submit_password"
          onClick={handleConfirm}
          disabled={isLoading || !hasStateChanged}
          aria-busy={isLoading}
        >
          GUARDAR
        </button>
      </div>
    </div>
  );
};

export default Switch2FA;