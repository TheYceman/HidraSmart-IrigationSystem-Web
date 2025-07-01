import React, { useState, useEffect, Suspense, lazy } from "react";
import styles from "../../public/styles/gestor-consumos/gestor-consumos.module.css";
import PopupConfig from "../components/pop-up/PopupConfiguration.jsx";
import ChangeNetwork from "../components/user-configuration/ChangeNetwork.jsx";
import ChangePassword from "../components/user-configuration/ChangePassword.jsx";
import Switch2FA from "../components/user-configuration/Switch2FA.jsx";
import UserManagement from "../components/user-configuration/UserManagement.jsx";
import { fetchUserData } from "../../public/scripts/fetch-user-data.js";

import '../../public/styles/pop-up/PopupConfiguration.css';

const PlanificadorRiego = lazy(() => import("../components/gestor-consumos/PlanificadorRiego.jsx"));
const GestionLecturas = lazy(() => import("../components/gestor-consumos/GestionLecturas.jsx"));
const GestionVolumenes = lazy(() => import("../components/gestor-consumos/GestionVolumenes.jsx"));
const DeclaracionCultivos = lazy(() => import("../components/gestor-consumos/DeclaracionCultivos.jsx"));

function GestorConsumos() {
  const [tab, setTab] = useState("planificador");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isConfigPopupOpen, setIsConfigPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [configData, setConfigData] = useState(null); // Define state for configData
  const [error, setError] = useState(null);
  const [swalLoaded, setSwalLoaded] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to refresh user data
  const refreshUserData = () => {
    fetchUserData()
      .then((data) => {
        setConfigData(data.user[0]); // Update configData with new data
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setConfigData(null);
      });
  };

  // Fetch user data on mount
  useEffect(() => {
    refreshUserData(); // Call the refresh function on mount
  }, []);

  const scriptCaptcha = "https://www.google.com/recaptcha/enterprise.js?render=6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX";
  const swal = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
  const dataVerification = "../../scripts/data-verification.js";

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

  // Define fadeMixinNotTime only when Swal is loaded
  const getFadeMixin = () => {
    if (!swalLoaded || !window.Swal) return null; // Guard against undefined Swal
    return window.Swal.mixin({
      icon: "warning",
      title: "General Title",
      animation: false,
      showClass: {
        popup: "animated fadeInDown faster",
        icon: "animated heartBeat delay-1s",
      },
      hideClass: {
        popup: "animated fadeOutUp faster",
      },
      customClass: {
        popup: "custom-dialog-class",
      },
    });
  };

  useEffect(() => {
    Promise.all([
      loadScript(scriptCaptcha),
      loadScript(swal),
      loadScript(dataVerification),
    ])
      .then(() => {
        setSwalLoaded(true); // Mark SweetAlert2 as loaded
      })
      .catch((error) => {
        console.error("Error loading scripts:", error);
      });

    // Cleanup: Remove scripts when component unmounts
    return () => {
      const scripts = document.querySelectorAll(`script[src="${swal}"], script[src="${scriptCaptcha}"]`);
      scripts.forEach((script) => script.remove());
    };
  }, []);

  const renderTab = () => {
    switch (tab) {
      case "planificador":
        return <PlanificadorRiego />;
      case "volumenes":
        return <GestionVolumenes />;
      case "lecturas":
        return <GestionLecturas />;
      case "cultivos":
        return <DeclaracionCultivos />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.gestor_consumos}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${tab === "planificador" ? styles.active_tab : ""}`}
          onClick={() => setTab("planificador")}
        >
          Planificador de Riego
        </div>
        <div
          className={`${styles.tab} ${tab === "lecturas" ? styles.active_tab : ""}`}
          onClick={() => setTab("lecturas")}
        >
          Gestión de Lecturas
        </div>
        <div
          className={`${styles.tab} ${tab === "volumenes" ? styles.active_tab : ""}`}
          onClick={() => setTab("volumenes")}
        >
          Gestión de Volúmenes
        </div>
        <div
          className={`${styles.tab} ${tab === "cultivos" ? styles.active_tab : ""}`}
          onClick={() => setTab("cultivos")}
        >
          Declaración de Cultivos
        </div>
        <button
          className={styles.config_button}
          onClick={() => setIsConfigPopupOpen(true)}
          title="Configuración"
        >
          ⚙️
        </button>
      </div>

      <div id="gestor-consumos-espacio" className={styles.gestor_consumos_espacio}>
        <Suspense fallback={<div>Cargando...</div>}>
          {renderTab()}
        </Suspense>
      </div>

      <PopupConfig
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        title="Imagen de lectura"
        width="600px"
        height="400px"
        footer={<button onClick={() => setIsImagePopupOpen(false)}>Cerrar</button>}
      />
      {/* Esto pasará a ser global en el panel de aplicaciones */}

      <PopupConfig
        isOpen={isConfigPopupOpen}
        height="400"
        onClose={() => setIsConfigPopupOpen(false)}
        title="CONFIGURACIÓN"
        popupData={configData} // Pass user data
      >
        <div className="config-popup-container">
          <div className="tab_wrap_popup_configuration">
            <input
              type="radio"
              id="tab1_configuration"
              name="tabGroup2_configuration"
              className="tab_popup_configuration"
              checked={activeTab === "tab1"}
              onChange={() => handleTabChange("tab1")}
            />
            <label htmlFor="tab1_configuration">Selección de Red</label>

            <input
              type="radio"
              id="tab2_configuration"
              name="tabGroup2_configuration"
              className="tab_popup_configuration"
              checked={activeTab === "tab2"}
              onChange={() => handleTabChange("tab2")}
            />
            <label htmlFor="tab2_configuration">Cambio Contraseña</label>

            <input
              type="radio"
              id="tab3_configuration"
              name="tabGroup2_configuration"
              className="tab_popup_configuration"
              checked={activeTab === "tab3"}
              onChange={() => handleTabChange("tab3")}
            />
            <label htmlFor="tab3_configuration">Doble Verificación</label>

            <input
              type="radio"
              id="tab4_configuration"
              name="tabGroup2_configuration"
              className="tab_popup_configuration"
              checked={activeTab === "tab4"}
              onChange={() => handleTabChange("tab4")}
            />
            <label htmlFor="tab4_configuration">Gestor de Usuarios</label>

            <ChangeNetwork 
              popupData={configData} 
              fadeMixinNotTime={getFadeMixin()}
              onNetworkChange={refreshUserData} />
            <ChangePassword popupData={configData} fadeMixinNotTime={getFadeMixin()} />
            <Switch2FA
              popupData={configData}
              fadeMixinNotTime={getFadeMixin()}
              on2FAChange={refreshUserData}
            />            <UserManagement popupData={configData} fadeMixinNotTime={getFadeMixin()} />
          </div>
        </div>
      </PopupConfig>
    </div>
  );
}

export default GestorConsumos;