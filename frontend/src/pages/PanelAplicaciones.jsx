import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PanelAplicaciones() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/applicationPanelResources", {
      credentials: "include", // 👈 importante para sesiones
    })
      .then((res) => {
        if (!res.ok) throw new Error("Acceso no autorizado");
        window.onLoginSuccess = () => {
            navigate("/panel-aplicaciones"); // o la ruta de tu dashboard
        };
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error("Error cargando el panel:", err.message);
        window.onLoginSuccess = () => {
            navigate("/panel-aplicaciones"); // o la ruta de tu dashboard
        };
        setData({ error: "No autorizado o error de red" });
      });
  }, []);

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
