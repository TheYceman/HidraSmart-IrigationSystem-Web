import React from "react";

function GestionLecturas() {
    return (
        <div>
            <h3>Gestión de Lecturas</h3>
            <p>Aquí se cargarán las lecturas de contadores de agua.</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Parcela</th>
                        <th>Lectura (m³)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>2025-06-01</td><td>Parcela 1</td><td>1234</td></tr>
                    <tr><td>2025-06-08</td><td>Parcela 2</td><td>4567</td></tr>
                    <tr><td>2025-06-10</td><td>Parcela 3</td><td>7890</td></tr>
                </tbody>
            </table>
        </div>
    );
}

export default GestionLecturas;
