import { useState, useEffect } from 'react';
import '../../../public/styles/pop-up/PopupConfiguration.css';
import { handleSwitch2FA } from '../../../public/scripts/switch-2FA';

const Switch2FA = ({ popupData, fadeMixinNotTime, on2FAChange }) => {
  // Estado original del 2FA (viene del servidor)
  const [original2FA, setOriginal2FA] = useState(popupData?.two_factor_enabled ?? false);
  // Estado temporal del checkbox (para mostrar visualmente)
  const [tempIs2FAEnabled, setTempIs2FAEnabled] = useState(popupData?.two_factor_enabled ?? false);
  // Estado para el botón habilitado/deshabilitado
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualizar estados cuando cambie popupData
  useEffect(() => {
    const enabled = popupData?.two_factor_enabled ?? false;
    setOriginal2FA(enabled);
    setTempIs2FAEnabled(enabled);
    setIsButtonEnabled(false); // Resetear el estado del botón cuando cambie popupData
  }, [popupData?.two_factor_enabled]);

  // Función para manejar el toggle del checkbox
  const handleCheckboxToggle = () => {
    if (!isLoading) {
      setTempIs2FAEnabled(!tempIs2FAEnabled);
      setIsButtonEnabled(!isButtonEnabled); // Alternar el estado del botón
    }
  };

  // Función para confirmar el cambio
  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await handleSwitch2FA(
        fadeMixinNotTime,
        original2FA, // Usar el estado original para determinar la acción
        popupData?.email
      );
      if (success) {
        // Actualizar el estado original al nuevo valor
        setOriginal2FA(tempIs2FAEnabled);
        setIsButtonEnabled(false); // Deshabilitar el botón tras éxito
        on2FAChange();
      } else {
        // Si falla, revertir el estado temporal al original
        setTempIs2FAEnabled(original2FA);
        setIsButtonEnabled(false); // Deshabilitar el botón tras fallo
      }
    } catch (err) {
      setError(err.message);
      // Si hay error, revertir el estado temporal al original
      setTempIs2FAEnabled(original2FA);
      setIsButtonEnabled(false); // Deshabilitar el botón tras error
    } finally {
      setIsLoading(false);
    }
  };








  return (
    <div className="tab_content_popup_configuration">
      <div id="container-switcher-2fa" className="container_switcher">
        <div className="slideCol_state">
          <div className="scroller_state">
            <div id="inner-element-state-2fa" className="inner_state change_state">
              <p>{tempIs2FAEnabled ? 'ACTIVADA' : 'DESACTIVADA'}</p>
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
              onChange={handleCheckboxToggle}
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
          disabled={isLoading || !isButtonEnabled}
          aria-busy={isLoading}
        >
          GUARDAR
        </button>
      </div>
    </div>
  );
};

export default Switch2FA;