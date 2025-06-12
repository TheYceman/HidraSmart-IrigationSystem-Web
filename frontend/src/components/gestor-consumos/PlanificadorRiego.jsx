import React, { useState } from "react";
import "../../../public/styles/gestor-consumos/planificador-riego.css";

function PlanificadorRiego() {

    const [duracion, setDuracion] = useState("total");

    return (
        <div className="contenedor_principal">
            <div className="columna_izquierda">
                <div className="cabecera_izquierda">
                    <div className="filtros_select">
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
                    <div className="filtros_duracion">
                        Duracion
                        <div>
                            <button
                                className={duracion === "total" ? "active_duracion" : ""}
                                onClick={() => setDuracion("total")}
                            >
                                Total
                            </button>
                            <button
                                className={duracion === "turnos" ? "active_duracion" : ""}
                                onClick={() => setDuracion("turnos")}
                            >
                                Por Turnos
                            </button>
                        </div>
                    </div>
                </div>
                <div className="tabla_contenedor custom_scrollbar">
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
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 10 }).map((_, rowIdx) => (
                                <tr key={rowIdx}>
                                    {Array.from({ length: 8 }).map((_, colIdx) => (
                                        <td key={colIdx}>Fila {rowIdx + 1}, Col {colIdx + 1}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="botones_izquierda">
                    <button>
                        <i class="fas fa-plus"></i>
                        Añadir turno
                    </button>
                    <button>
                        <i class="fas fa-trash"></i>
                        Eliminar
                    </button>
                    <button>
                        <i class="fas fa-play"></i>
                        Previsión
                    </button>
                </div>
            </div>

            <div className="columna_derecha">
                Contenido derecho para el mapa
            </div>
        </div>
    );
}

export default PlanificadorRiego;
