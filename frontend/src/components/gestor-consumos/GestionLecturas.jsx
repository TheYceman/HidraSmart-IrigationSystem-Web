import { useEffect, useState } from "react";
import styles from "../../../public/styles/gestor-consumos/gestion-lecturas.module.css";

//Obtener API Key para el mapa
import GoogleApiKeyProvider from "../api-keys/GoogleApiKeyProvider";

function GestionLecturas() {

    const [setIsImagePopupOpen] = useState(false);

    // Este es el método que quieres:
    function openImageLectura() {
        setIsImagePopupOpen(true);
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/scripts/gestor-consumos/gestion-lecturas.js";
        document.body.appendChild(script);
    }, []);

    return (

        <div className={styles.contenedor_principal}>
            <div className={`${styles.peticiones_lectura} ${styles.filtros_tabla}`}>
                <div className={styles.filtros}>
                    <div>
                        <label htmlFor="periodo-select-1">Seleccione día</label>
                        <input type="datetime-local" id="periodo-select-1" name="fecha" />
                    </div>
                    <div>
                        <label htmlFor="sector-select">Balsa</label>
                        <select name="sector" id="sector-select">
                            <option value="todos">Todos</option>
                            <option value="sector1">Sector 1</option>
                            <option value="sector2">Sector 2</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="contador-select">Contador</label>
                        <select name="contador" id="contador-select">
                            <option value="0CM0201">Todos</option>
                            <option value="0CM0201">0CM0201</option>
                            <option value="0CM0202">0CM0202</option>
                            <option value="0CM0203">0CM0203</option>
                        </select>
                    </div>
                    <button><i className="fas fa-folder-open"></i>Exportar a Excel</button>
                </div>
                <div className="custom_scrollbar">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha Hora</th>
                                <th>Nombre</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 14 }).map((_, i) => (
                                <tr key={i}>
                                    <td>Dato 1</td>
                                    <td>Dato 2</td>
                                    <td><i className="fas fa-edit"></i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.grafica_contenedor}>
                <div id="grafica-lecturas" className={styles.grafica}>

                </div>
            </div>

            <div className={`${styles.lecturas}`}>
                <div className="custom_scrollbar">
                    <table>
                        <thead>
                            <tr>
                                <th>Contador</th>
                                <th>Fecha Lectura</th>
                                <th>Usuario</th>
                                <th>Volumen (m3)</th>
                                <th>Accion</th>
                                <th>Imagen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 14 }).map((_, i) => (
                                <tr key={i}>
                                    <td>Dato 1</td>
                                    <td>Dato 2</td>
                                    <td>Dato 3</td>
                                    <td>Dato 4</td>
                                    <td><i className="fas fa-edit"></i></td>
                                    <td><i onClick={openImageLectura} className="fas fa-image"></i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.mapa}>
                <div id="mapa-lecturas" className={styles.mapa_lecturas}></div>
                <GoogleApiKeyProvider />
            </div>
 

        </div>
    );
}

export default GestionLecturas;
