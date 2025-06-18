import { useEffect, useState, useRef } from "react";
//Estilos
import styles from "../../../public/styles/gestor-consumos/gestion-lecturas.module.css";

//Scripts
import GoogleApiKeyProvider from "../api-keys/GoogleApiKeyProvider";
import PopupConfig from "../pop-up/PopupConfiguration";
import {
    fetchPeticiones,
    fetchLecturas,
    fetchLecturasByContador,
    fetchContadores,
    fetchBalsasDisponibles
} from "../../api/gestion-lectura-api.js";

function GestionLecturas() {

    // Balsas
    const [balsas, setBalsas] = useState([]);

    // Peticiones   
    const [peticiones, setPeticiones] = useState([]);
    const [selectedBalsa, setSelectedBalsa] = useState("all");

    // Lecturas
    const [lecturas, setLecturas] = useState([]);
    const [selectedContador, setSelectedContador] = useState("all");

    // Contadores
    const [contadores, setContadores] = useState([]);

    // Popup
    const [popupContent, setPopupContent] = useState(null);
    const [popupTitle, setPopupTitle] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Variables para crear nueva lectura
    const fileInputRef = useRef(null);

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    /**
     * Abre un popup con el título y contenido proporcionados.
     * 
     * @param {string} title - Título del popup
     * @param {JSX.Element} content - Contenido del popup
     */
    const openPopup = (title, content) => {
        setPopupTitle(title);
        setPopupContent(content);
        setIsPopupOpen(true);
    };

    /**
     * Handler para el evento de cambio de la select de balsas.
     * 
     * @param {Event} e - Evento de cambio de la select
     * 
     * Actualiza el estado de 'selectedBalsa' con el valor de la balsa seleccionada,
     * y llama a fetchPeticiones con el sufijo de la base de datos correspondiente
     * (si se selecciona "all", se utiliza el sufijo "x"). El resultado se guarda
     * en el estado de 'peticiones'.
     */
    const handleBalsaChange = async (e) => {
        const balsaValue = e.target.value;
        setSelectedBalsa(balsaValue);

        const dbSuffix = balsaValue === "all" ? "x" : balsaValue;
        const datos = await fetchPeticiones(dbSuffix);
        setPeticiones(datos);

        const datosContadores = await fetchContadores(dbSuffix);
        setContadores(datosContadores);
    };


    /**
     * Handler para el evento de cambio de la select de contadores.
     * 
     * @param {Event} e - Evento de cambio de la select
     * 
     * Actualiza el estado de 'selectedContador' con el valor del contador seleccionado,
     * y llama a fetchLecturas con el sufijo de la base de datos correspondiente
     * (si se selecciona "all", se utiliza el sufijo "x"). El resultado se guarda
     * en el estado de 'lecturas'. Si el valor seleccionado no es "all", se hace
     * una petición GET a "/api/is-bx/lecturas/:contadorId" y se guardan las
     * lecturas en el estado de 'lecturas'. Si la petición no devuelve un array,
     * se vacía el estado de 'lecturas'.
     */
    const handleContadorChange = async (e) => {
        const contadorValue = e.target.value;
        setSelectedContador(contadorValue);

        if (contadorValue === "all") {
            const datosLecturas = await fetchLecturas("x");
            setLecturas(datosLecturas);
        } else {
            const datosLecturas = await fetchLecturasByContador("x", contadorValue);
            setLecturas(datosLecturas);
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/scripts/gestor-consumos/gestion-lecturas.js";
        document.body.appendChild(script);

        const loadInitialData = async () => {
            const datosPeticiones = await fetchPeticiones("x");
            setPeticiones(datosPeticiones);

            const datosLecturas = await fetchLecturas("x");
            setLecturas(datosLecturas);

            const datosContadores = await fetchContadores("x");
            setContadores(datosContadores);

            const balsasDisponibles = await fetchBalsasDisponibles();
            setBalsas(balsasDisponibles);
        };

        loadInitialData();
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
                            <label htmlFor="balsa-select">Balsa</label>
                            <select value={selectedBalsa} onChange={handleBalsaChange}>
                                {balsas.length === 0 ? (
                                    <option disabled value="">No hay balsas disponibles</option>
                                ) : (
                                    <>
                                        {balsas.map((balsa) => (
                                            <option key={balsa} value={balsa}>
                                                Balsa {balsa === 'x' ? 'Todas' : balsa}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>

                        </div>
                        <div>
                            <label htmlFor="contador-select">Contador</label>
                            <select name="contador" id="contador-select" onChange={handleContadorChange}>
                                {contadores.length === 0 ? (
                                    <option value="" disabled>Sin contadores disponibles</option>
                                ) : (
                                    <>
                                        <option value="all">Todos</option>
                                        {contadores.map((item, i) => (
                                            <option key={i} value={item.ideEle}>{item.ideEle}</option>
                                        ))}
                                    </>
                                )}
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
                                    <th>Solicitante</th>
                                    <th>Asignado</th>
                                    <th>Prioridad</th>
                                    <th>Estado</th>
                                    <th>Tipo</th>
                                    <th>Comentarios</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {peticiones.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                                            No hay datos disponibles para las opciones seleccionadas
                                        </td>
                                    </tr>
                                ) : (
                                    peticiones.map((item, i) => (
                                        <tr key={i}>
                                            <td>{new Date(item.fecha).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</td>
                                            <td>{item.name}</td>
                                            <td>{item.requester}</td>
                                            <td>{item.assignedTo}</td>
                                            <td>{item.priority}</td>
                                            <td>{item.status}</td>
                                            <td>{item.type}</td>
                                            <td>
                                                <span
                                                    onClick={() => openPopup("Comentario", <div style={{ padding: "20px" }}>{item.comments}</div>)}
                                                    className={styles.ver_mas}
                                                >
                                                    <i className="fas fa-align-left"></i>Ver más
                                                </span>
                                            </td>
                                            <td><i className="fas fa-edit"></i></td>
                                        </tr>
                                    ))
                                )}
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
                            {lecturas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                        No hay datos disponibles para las opciones seleccionadas
                                    </td>
                                </tr>
                            ) : (
                                lecturas.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.contador}</td>
                                        <td>{new Date(item.fecha).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</td>
                                        <td>{item.usuario}</td>
                                        <td>{item.volumen}</td>
                                        <td>
                                            <span
                                                onClick={() => openPopup("Imagen de lectura", <div style={{ padding: "20px" }}>Aquí irá la imagen</div>)}
                                                className={styles.ver_mas}
                                            >
                                                <i className="fas fa-image"></i>Ver imagen
                                            </span>
                                        </td>
                                        <td><i className="fas fa-edit"></i></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.mapa}>
                <div id="mapa-lecturas" className={styles.mapa_lecturas}></div>
                <GoogleApiKeyProvider />
            </div>

            <PopupConfig
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={popupTitle}
                width="600px"
                height="auto"
            >
                <div style={{ textAlign: "center" }}>
                    {popupContent}
                </div>
            </PopupConfig>

        </div>
    );
}

export default GestionLecturas;
