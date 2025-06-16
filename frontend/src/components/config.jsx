import React, { useState } from 'react';
import '../styles/config.css';

const ConfigurationPopup = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  var [currentPassword, setCurrentPassword] = useState('');
  var [newPassword, setNewPassword] = useState('');
  var [confirmPassword, setRepeatPassword] = useState('');
  var [message, setMessage] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handle2FAToggle = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar que todos los campos estén completos
  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    fadeMixinNotTime.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, completa todos los campos.",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  // Validar que la nueva contraseña y la repetida coincidan
  if (newPassword !== confirmPassword) {
    fadeMixinNotTime.fire({
      icon: "warning",
      title: "Contraseñas no coinciden",
      text: "La nueva contraseña y su confirmación deben ser iguales.",
      confirmButtonText: "Aceptar",
    });
    return;
  }


   let token;
  try {
    token = await grecaptcha.enterprise.execute(
      "6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX",
      { action: "changePassword" }
    );
  } catch (error) {
    console.error("Error al obtener token de reCAPTCHA:", error);
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Error de verificación",
      text: "No se pudo verificar la solicitud. Inténtalo de nuevo.",
      confirmButtonText: "Aceptar",
    });
    return;
  }

  try {
    const response = await fetch("/api/changePasswordReact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword,
        token: token,
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud de cambio de contraseña");
    }

    const data = await response.json();
    if (data.success) {
      fadeMixinNotTime.fire({
        icon: "success",
        title: "Contraseña cambiada",
        text: "La contraseña ha sido actualizada correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        currentPassword = "";
        newPassword = "";
        confirmPassword = "";
      });
    } else {
      fadeMixinNotTime.fire({
        icon: "error",
        title: "Error al cambiar contraseña",
        text: data.message || "No se pudo cambiar la contraseña.",
        confirmButtonText: "Aceptar",
      });
    }
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    fadeMixinNotTime.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar con el servidor. Inténtalo más tarde.",
      confirmButtonText: "Aceptar",
    });
  }
}


  return (
    <div className="config-popup-overlay">
      <div className="config-popup-container">
        <span id="title-popup-configuration" className="title_popup_configuration">
          CONFIGURACIÓN
        </span>
        <button
          id="close-popup"
          className="close_popup"
          aria-label="Close popup"
          onClick={onClose}
        >
          ×
        </button>
        <div className="tab_wrap_popup_configuration">
          <input
            type="radio"
            id="tab1_configuration"
            name="tabGroup2_configuration"
            className="tab_popup_configuration"
            checked={activeTab === 'tab1'}
            onChange={() => handleTabChange('tab1')}
          />
          <label htmlFor="tab1_configuration">Selección de Red</label>

          <input
            type="radio"
            id="tab2_configuration"
            name="tabGroup2_configuration"
            className="tab_popup_configuration"
            checked={activeTab === 'tab2'}
            onChange={() => handleTabChange('tab2')}
          />
          <label htmlFor="tab2_configuration">Cambio Contraseña</label>

          <input
            type="radio"
            id="tab3_configuration"
            name="tabGroup2_configuration"
            className="tab_popup_configuration"
            checked={activeTab === 'tab3'}
            onChange={() => handleTabChange('tab3')}
          />
          <label htmlFor="tab3_configuration">Doble Verificación</label>

          <input
            type="radio"
            id="tab4_configuration"
            name="tabGroup2_configuration"
            className="tab_popup_configuration"
            checked={activeTab === 'tab4'}
            onChange={() => handleTabChange('tab4')}
          />
          <label htmlFor="tab4_configuration">Gestor de Usuarios</label>

          <div className="tab_content_popup_configuration">
            <div
              id="container-submit-network-selection"
              className="container_submit_password"
              style={{ flexDirection: 'column' }}
            >
              <div
                className="network-selector-container"
                style={{
                  width: '95%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div className="inputGroup">
                  <input
                    value="alcazar"
                    id="radio0"
                    name="radio"
                    type="radio"
                  />
                  <label htmlFor="radio0">Alcázar de San Juan</label>
                </div>

                <div className="inputGroup">
                  <input
                    value="corral"
                    id="radio1"
                    name="radio"
                    type="radio"
                  />
                  <label htmlFor="radio1">Corral de Calatrava</label>
                </div>
              </div>

              <button
                id="button-submit-network-selection"
                className="button_common"
                type="button"
              ></button>
            </div>

          </div>

          <div className="tab_content_popup_configuration">
            <form
              id="form-popup-configuration"
              className="form_popup_configuration"
              autoComplete="off"
              inputMode="none"
              aria-autocomplete="none"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div id="body-form-popup-configuration" className="body_form_popup_configuration">
                <div id="fields-popup-configuration" className="fields_popup_configuration">
                  <label className="label_old_password">
                    <input
                      type="password"
                      id="input-old-password"
                      className="input_old_password"
                      placeholder=" "
                      autoComplete="current-password"
                      onChange={(e) => setCurrentPassword(e.target.value)}

                    />
                    <span className="label_name_old_password">Antigua Contraseña</span>
                    <span className="label_icon_old_password"></span>
                    <span className="label_icon_check_old_password"></span>
                  </label>
                  <label id="label-new-passwor" className="label_new_password">
                    <input
                      type="password"
                      id="input-new-password"
                      className="input_new_password"
                      placeholder=" "
                      autoComplete="new-password"
                      onChange={(e) => setNewPassword(e.target.value)}

                    />
                    <span className="label_name_new_password">Nueva Contraseña</span>
                    <span className="label_icon_new_password"></span>
                    <span className="label_icon_check_new_password"></span>
                  </label>
                  <label className="label_repeat_password">
                    <input
                      type="password"
                      id="input-repeat-password"
                      className="input_repeat_password"
                      placeholder=" "
                      autoComplete="new-password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <span className="label_name_repeat_password">Repetir Contraseña</span>
                    <span className="label_icon_repeat_password"></span>
                    <span className="label_icon_check_repeat_password"></span>
                  </label>
                </div>
                <div className="field_rules_new_password_popup_configuration">
                  <ul className="field_rules_popup_configuration">
                    <li>Una letra minúscula</li>
                    <li>Una letra mayúscula</li>
                    <li>Un número</li>
                    <li>Un carácter especial</li>
                    <li>Mínimo 9 caracteres</li>
                    <li>Distinta de la contraseña anterior</li>
                  </ul>
                </div>
              </div>
              <div id="container-submit-password" className="container_submit_password">
                <button
                  id="submit-password"
                  className="button_submit_password"
                  type="submit"
                ></button>
              </div>
            </form>
          </div>

          <div className="tab_content_popup_configuration">
            <div id="container-swicher-2Authentication" className="container_swicher">
              <div className="slideCol_state">
                <div className="scroller_state">
                  <div id="inner-element-state-2Authentication" className="inner_state">
                    <p>Activada</p>
                    <p>Desactivada</p>
                  </div>
                </div>
              </div>
              <div id="2Authentication-state" className="checkbox">
                <label className="checkbox__container">
                  <input
                    id="input-2Authentication-state"
                    className="checkbox__toggle"
                    type="checkbox"
                    checked={is2FAEnabled}
                    onChange={handle2FAToggle}
                  />
                  <span className="checkbox__checker"></span>
                  <span className="checkbox__cross"></span>
                  <span className="checkbox__ok"></span>
                  <svg
                    id="svg-2Authentication-state"
                    className="checkbox__bg"
                    space="preserve"
                    style={{ enableBackground: 'new 0 0 110 43.76' }}
                    version="1.1"
                    viewBox="0 0 110 43.76"
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
              <button
                id="button-change-2Authentication"
                className="button_submit_password"
                disabled
              ></button>
            </div>
          </div>

          <div className="tab_content_popup_configuration">
            <span
              id="title-popup-configuration-user"
              className="title_popup_configuration_user"
            >
              GESTIÓN DE USUARIOS
            </span>
            <div
              className="dropdown-container"
              style={{
                margin: '20px',
                position: 'relative',
                zIndex: 1002,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <label
                htmlFor="dropdown"
                style={{
                  fontSize: '16px',
                  marginRight: '10px',
                  color: '#333',
                }}
              >
                Selecciona una opción:
              </label>
              <select
                id="dropdown"
                name="dropdown"
                style={{
                  padding: '8px',
                  fontSize: '14px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '200px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1003,
                  appearance: 'auto',
                  WebkitAppearance: 'auto',
                  MozAppearance: 'auto',
                }}
              >
                <option value="opcion1">Opción 1</option>
                <option value="opcion2">Opción 2</option>
                <option value="opcion3">Opción 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPopup;