import React, { useState, Suspense, lazy } from "react";
import styles from "../../public/styles/gestor-consumos/gestor-consumos.module.css";

const PlanificadorRiego = lazy(() => import("../components/gestor-consumos/PlanificadorRiego.jsx"));
const GestionLecturas = lazy(() => import("../components/gestor-consumos/GestionLecturas.jsx"));
const GestionVolumenes = lazy(() => import("../components/gestor-consumos/GestionVolumenes.jsx"));
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
            </div>

            <div id="gestor-consumos-espacio" className={styles.gestor_consumos_espacio}>
                <Suspense fallback={<div>Cargando...</div>}>
                    {renderTab()}
                </Suspense>
            </div>
        </div>
    );
}

export default GestorConsumos;
