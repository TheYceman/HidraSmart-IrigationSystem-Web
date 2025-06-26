import { useEffect, useState, useRef } from "react";
import styles from "../../../public/styles/gestor-consumos/gestion-lecturas.module.css";

//Obtener API Key para el mapa
import GoogleApiKeyProvider from "../api-keys/GoogleApiKeyProvider";

function GestionLecturas() {

    const [setIsImagePopupOpen] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

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
            <div className={`${styles.peticiones_lectura}`}>
                <div className={`${styles.titulo_pestania}`}>PETICIONES</div>
                <div className={styles.filtros_tabla}>
                    <div className={styles.filtros}>
                        <div>
                            <label htmlFor="periodo-select-1">Seleccione día</label>
                            <input type="datetime-local" id="periodo-select-1" name="fecha" />
                        </div>
                        <div>
                            <label htmlFor="sector-select">Balsa</label>
                            <select name="sector" id="sector-select">
                                <option value="todos">Todas</option>
                                <option value="1">Balsa 1</option>
                                <option value="2">Balsa 2</option>
                                <option value="3">Balsa 3</option>
                                <option value="4">Balsa 4</option>
                                <option value="5">Balsa 5</option>
                                <option value="6">Balsa 6</option>
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
                    <div className={`${styles.contenedor_scroll} custom_scrollbar`}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Nombre</th>
                                    <th>Pedidor</th>
                                    <th>Asignado</th>
                                    <th>Prioridad</th>
                                    <th>Estado</th>
                                    <th>Tipo</th>
                                    <th>Comentarios</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 14 }).map((_, i) => (
                                    <tr key={i}>
                                        <td>Dato 1</td>
                                        <td>Dato 2</td>
                                        <td>Dato 3</td>
                                        <td>Dato 4</td>
                                        <td>Dato 5</td>
                                        <td>Dato 6</td>
                                        <td>Dato 7</td>
                                        <td>
                                            <span onClick={openImageLectura} className={styles.ver_mas}>
                                                <i className="fas fa-align-left"></i>Ver más
                                            </span>
                                        </td>
                                        <td><i className="fas fa-edit"></i></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className={styles.grafica_contenedor}>
                <div id="grafica-lecturas" className={styles.grafica}>

                </div>
            </div>

            <div className={`${styles.lecturas}`}>
                <div className={`${styles.titulo_pestania}`}>LECTURAS DE CONTADORES</div>
                <div className={`${styles.contenedor_scroll} custom_scrollbar`}>
                    <table>
                        <thead>
                            <tr>
                                <th>Contador</th>
                                <th>Fecha Lectura</th>
                                <th>Usuario</th>
                                <th>Volumen (m3)</th>
                                <th>Imagen</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" name="" id="" /></td>
                                <td><input type="datetime-local" name="" id="" /></td>
                                <td><input type="text" name="" id="" /></td>
                                <td><input type="text" name="" id="" /></td>
                                <td>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                    <button onClick={handleFileButtonClick}>Subir archivo</button>
                                </td>
                                <td><i className="fas fa-plus"></i></td>
                            </tr>
                            {Array.from({ length: 15 }).map((_, i) => (
                                <tr key={i}>
                                    <td>Dato 1</td>
                                    <td>Dato 2</td>
                                    <td>Dato 3</td>
                                    <td>Dato 4</td>
                                    <td>
                                        <span onClick={openImageLectura} className={styles.ver_mas}>
                                            <i className="fas fa-image"></i>Ver imagen
                                        </span>
                                    </td>
                                    <td><i className="fas fa-edit"></i></td>
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

            <PopupConfig
                isOpen={isImagePopupOpen}
                onClose={() => setIsImagePopupOpen(false)}
                title="Imagen de lectura"
                width="600px"
                height="400px"
            >
                <div style={{ textAlign: "center" }}>
                    <img src="https://via.placeholder.com/300" alt="Imagen seleccionada" />
                </div>
            </PopupConfig>
        </div>
    );
}

export default GestionLecturas;
