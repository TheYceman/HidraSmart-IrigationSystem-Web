import { useState, useEffect } from "react";
import styles from "../../../public/styles/gestor-consumos/planificador-riego.module.css";

//Obtener API Key para el mapa
import GoogleApiKeyProvider from "../api-keys/GoogleApiKeyProvider";

function PlanificadorRiego() {
    const [duracion, setDuracion] = useState("total");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/scripts/gestor-consumos/planificador-riego.js";
        document.body.appendChild(script);
    }, []);

    return (
        <div className={styles.contenedor_principal}>
            <div className={styles.columna_izquierda}>
                <div className={styles.cabecera_izquierda}>
                    <div className={styles.filtros_select}>
                        <div>
                            <label htmlFor="balsa-select">Balsa</label>
                            <select name="balsa" id="balsa-select">
                                <option value="todos">Todos</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="parcela-select">Parcela</label>
                            <select name="parcela" id="parcela-select">
                                <option value="todos">Todos</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="contador-select">Contador</label>
                            <select name="contador" id="contador-select">
                                <option value="todos">Todos</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.filtros_duracion}>
                        Duración
                        <div>
                            <button
                                className={duracion === "total" ? styles.active_duracion : ""}
                                onClick={() => setDuracion("total")}
                            >
                                Total
                            </button>
                            <button
                                className={duracion === "turnos" ? styles.active_duracion : ""}
                                onClick={() => setDuracion("turnos")}
                            >
                                Por Turnos
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`${styles.tabla_contenedor} ${styles.custom_scrollbar}`}>
                    <table>
                        <thead>
                            <tr>
                                <th>Parcela</th>
                                <th>Contador</th>
                                <th>Inicio - Fin</th>
                                <th>Presión (mca)</th>
                                <th>Caudal (m3/h)</th>
                                <th>Vol. Acum.</th>
                                <th>Vol. Parc.</th>
                                <th>Vol. Rest.</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 10 }).map((_, rowIdx) => (
                                <tr key={rowIdx}>
                                    {Array.from({ length: 9 }).map((_, colIdx) => (
                                        <td key={colIdx}>Fila {rowIdx + 1}, Col {colIdx + 1}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.botones_izquierda}>
                    <button>
                        <i className="fas fa-plus"></i>
                        Añadir turno
                    </button>
                    <button>
                        <i className="fas fa-trash"></i>
                        Eliminar
                    </button>
                    <button>
                        <i className="fas fa-play"></i>
                        Previsión
                    </button>
                </div>
            </div>

            <div className={styles.columna_derecha}>
                <div id="mapa-riego" className={styles.mapa_riego}></div>
                <GoogleApiKeyProvider />
            </div>
        </div>
    );
}

export default PlanificadorRiego;
