import React, { useState, Suspense, lazy } from "react";
import "../../public/styles/gestor-consumos/gestor-consumos.css";

const PlanificadorRiego = lazy(() => import("../components/gestor-consumos/PlanificadorRiego.jsx"));
const GestionVolumenes = lazy(() => import("../components/gestor-consumos/GestionVolumenes.jsx"));
const GestionLecturas = lazy(() => import("../components/gestor-consumos/GestionLecturas.jsx"));
const DeclaracionCultivos = lazy(() => import("../components/gestor-consumos/DeclaracionCultivos.jsx"));

function GestorConsumos() {
    const [tab, setTab] = useState("planificador");

    const renderTab = () => {
        switch (tab) {
            case "planificador": return <PlanificadorRiego />;
            case "volumenes": return <GestionVolumenes />;
            case "lecturas": return <GestionLecturas />;
            case "cultivos": return <DeclaracionCultivos />;
            default: return null;
        }
    };

    return (
        <div className="gestor_consumos">
            <div className="tabs">
                <div className={tab === "planificador" ? "tab active_tab" : "tab"} onClick={() => setTab("planificador")}>Planificador de Riego</div>
                <div className={tab === "lecturas" ? "tab active_tab" : "tab"} onClick={() => setTab("lecturas")}>Gestión de Lecturas</div>
                <div className={tab === "volumenes" ? "tab active_tab" : "tab"} onClick={() => setTab("volumenes")}>Gestión de Volúmenes</div>
                <div className={tab === "cultivos" ? "tab active_tab" : "tab"} onClick={() => setTab("cultivos")}>Declaración de Cultivos</div>
            </div>

            <div id="gestor-consumos-espacio" className="gestor_consumos_espacio">
                <Suspense fallback={<div>Cargando...</div>}>
                    {renderTab()}
                </Suspense>
            </div>
        </div>
    );
}

export default GestorConsumos;

