import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PanelAplicaciones() {
  const [data, setData] = useState(null);
  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica si el usuario acaba de iniciar sesión
    if (location.state?.justLoggedIn) {
      setShowConfigPopup(true);
      // Limpia el estado de navegación
      navigate(location.pathname, { replace: true, state: {} });
    }

    fetch("/api/applicationPanelResources", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Acceso no autorizado");
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error("Error cargando el panel:", err.message);
        setData({ error: "No autorizado o error de red" });
      });
  }, [navigate, location]);

  // Manejar clics en el botón de configuración usando delegación de eventos
  useEffect(() => {
    const handleConfigClick = (event) => {
      if (event.target.closest("#config-button")) {
        setShowConfigPopup((prev) => !prev);
      }
    };

    // Añadir listener al documento
    document.addEventListener("click", handleConfigClick);

    // Limpieza del listener
    return () => {
      document.removeEventListener("click", handleConfigClick);
    };
  }, []); // Dependencia vacía para que el listener se añada solo una vez

  if (!data) return <div>Cargando panel...</div>;

  if (data.error) {
    return <div>{data.error}</div>;
  }

  return (
    <>
      <header>
        <div dangerouslySetInnerHTML={{ __html: data.headApplicationPanelHTML }} />
      </header>
      <main>
        <div dangerouslySetInnerHTML={{ __html: data.bodyApplicationPanelHTML }} />
      </main>
    </>
  );
}

export default PanelAplicaciones;