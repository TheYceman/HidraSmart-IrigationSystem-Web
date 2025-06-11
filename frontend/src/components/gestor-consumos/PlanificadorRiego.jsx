import React from "react";
import "../../../public/styles/gestor-consumos/planificador-riego.css";

function PlanificadorRiego() {
    return (
        <div className="contenedor_principal">
            <div className="columna_izquierda">
                <div className="cabecera_izquierda">
                    <div className="filtros_select">
                        <div>
                            Balsa
                            <select name="balsa" id="">
                                <option value="todos">Todos</option>
                            </select>
                        </div>
                        <div>
                            Parcela
                            <select name="balsa" id="">
                                <option value="todos">Todos</option>
                            </select>
                        </div>
                        <div>
                            Contador
                            <select name="balsa" id="">
                                <option value="todos">Todos</option>
                            </select>
                        </div>
                    </div>
                    <div className="filtros_duracion">
                        Duracion
                        <div>
                            <button>Total</button>
                            <button>Por Turnos</button>
                        </div>
                    </div>
                </div>
                <div className="tabla_contenedor">
                    <table>
                        <thead>
                            <tr>
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <th key={idx}>Col {idx + 1}</th>
                                ))}
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
                    <button>Añadir turno</button>
                    <button>Eliminar</button>
                    <button>Previsión</button>
                </div>
            </div>

            <div className="columna_derecha">
                Contenido derecho para el mapa
            </div>
        </div>
    );
}

export default PlanificadorRiego;
