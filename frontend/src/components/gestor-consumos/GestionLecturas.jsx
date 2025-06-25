import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import Select from "react-select";

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
    fetchBalsasDisponibles,
    fetchNombreUsuario,
    fetchNombreTipoPeticion,
} from "../../api/gestion-lectura-api.js";

function GestionLecturas() {
    // Balsas
    const [balsas, setBalsas] = useState([]);

    // Peticiones
    const [peticiones, setPeticiones] = useState([]);
    const [selectedBalsa, setSelectedBalsa] = useState("all");

    //Tipos peticiones
    const [tiposMap, setTiposMap] = useState({});

    // Fecha
    const [selectedFecha, setSelectedFecha] = useState("");

    // Lecturas
    const [lecturas, setLecturas] = useState([]);
    const [selectedContador, setSelectedContador] = useState("all");

    // Contadores
    const [contadores, setContadores] = useState([]);
    const [filtroContador, setFiltroContador] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredContadores = useMemo(() => {
        return contadores.filter(c =>
            c.ideEle?.toLowerCase().includes(filtroContador.toLowerCase())
        );
    }, [contadores, filtroContador]);

    // Usuarios
    const [usuariosMap, setUsuariosMap] = useState({});

    // Popup
    const [popupContent, setPopupContent] = useState(null);
    const [popupTitle, setPopupTitle] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Variables para crear nueva lectura
    const fileInputRef = useRef(null);
    const [nuevaLectura, setNuevaLectura] = useState({
        fecha: "",
        usuario: "",
        volumen: "",
        imagenBase64: "",
    });


    const cargarUsuariosPorIds = async (ids) => {
        const nuevoMapa = { ...usuariosMap };

        const idsNoCargados = ids.filter(id => id && !nuevoMapa[id]);

        const promesas = idsNoCargados.map(id =>
            fetchNombreUsuario(id).then(res => {
                nuevoMapa[id] = res.username;
            }).catch(() => {
                nuevoMapa[id] = `ID ${id}`;
            })
        );

        await Promise.all(promesas);
        setUsuariosMap(nuevoMapa);
    };

    const cargarTiposPorIds = async (ids) => {
        const idsUnicos = [...new Set(ids)];
        const tiposNoCargados = idsUnicos.filter(id => id && !tiposMap[id]);

        if (tiposNoCargados.length === 0) return;

        const nuevoMap = { ...tiposMap };

        await Promise.all(tiposNoCargados.map(async (id) => {
            try {
                const tipo = await fetchNombreTipoPeticion(selectedBalsa, id);
                nuevoMap[id] = tipo || `Tipo ${id}`;
            } catch (error) {
                nuevoMap[id] = `Tipo ${id}`;
            }
        }));

        setTiposMap(nuevoMap);
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 1024 * 1024) { // 1 MB
            openPopup("Error", <p>La imagen no debe superar 1 MB.</p>);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevaLectura((prev) => ({ ...prev, imagenBase64: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const subirLectura = async () => {
        if (selectedContador === "all") {
            openPopup("Error", <p>Debes seleccionar un contador específico.</p>);
            return;
        }

        const payload = {
            contador: selectedContador,
            fecha: nuevaLectura.fecha,
            usuario: nuevaLectura.usuario,
            volumen: parseFloat(nuevaLectura.volumen),
            imagen: nuevaLectura.imagenBase64
        };

        try {
            await axios.post(`/api/is-b${selectedBalsa}/lecturas`, payload);
            // Mostrar popup de éxito
            openPopup("Lectura guardada", <p>La lectura se ha guardado correctamente.</p>);

            // Recargar lecturas
            const datosLecturas = await fetchLecturasByContador(selectedBalsa, selectedContador, selectedFecha);
            setLecturas(datosLecturas);

            // Limpiar campos
            setNuevaLectura({
                fecha: '',
                usuario: '',
                volumen: '',
                imagenBase64: ''
            });
        } catch (err) {
            openPopup("Error", <p>Ocurrió un error al guardar la lectura.</p>);
            console.error(err);
        }
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
        setFiltroContador("");
        setSelectedContador("all");

        const datos = await fetchPeticiones(balsaValue);
        setPeticiones(datos);

        const datosContadores = await fetchContadores(balsaValue);
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
    const handleContadorChange = async (contadorValue) => {
        setSelectedContador(contadorValue);
        if (contadorValue === "all") {
            setFiltroContador("Todos");
        } else {
            setFiltroContador(contadorValue);
        }
        setShowDropdown(false);

        if (contadorValue === "all") {
            const datosLecturas = await fetchLecturas(selectedBalsa, selectedFecha);
            setLecturas(datosLecturas);
        } else {
            const datosLecturas = await fetchLecturasByContador(selectedBalsa, contadorValue, selectedFecha);
            setLecturas(datosLecturas);
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/scripts/gestor-consumos/gestion-lecturas.js";
        document.body.appendChild(script);

        const loadInitialData = async () => {

            const [datosPeticiones, datosLecturas, datosContadores, balsasDisponibles] = await Promise.all([
                fetchPeticiones(selectedBalsa, selectedFecha),
                selectedContador === "all"
                    ? fetchLecturas(selectedBalsa, selectedFecha)
                    : fetchLecturasByContador(selectedBalsa, selectedContador, selectedFecha),
                fetchContadores(selectedBalsa),
                fetchBalsasDisponibles()
            ]);

            setPeticiones(datosPeticiones);
            setLecturas(datosLecturas);
            setContadores(datosContadores);
            setBalsas(balsasDisponibles);

            const idsUsuarios = new Set();
            datosPeticiones.forEach(p => {
                if (p.requester) idsUsuarios.add(p.requester);
                if (p.assignedTo) idsUsuarios.add(p.assignedTo);
            });
            datosLecturas.forEach(l => {
                if (l.usuario) idsUsuarios.add(l.usuario);
            });

            await cargarUsuariosPorIds([...idsUsuarios]);

            // Cargar nombres de los tipos de peticiones
            const tiposIds = [...new Set(datosPeticiones.map(p => p.type).filter(Boolean))];
            await cargarTiposPorIds(tiposIds);
        };

        loadInitialData();
    }, [selectedBalsa, selectedContador, selectedFecha]);

    return (
        <>
            <div className={styles.contenedor_principal}>
                <div className={`${styles.peticiones_lectura}`}>
                    <div className={`${styles.titulo_pestania}`}>PETICIONES</div>
                    <div className={styles.filtros_tabla}>
                        <div className={styles.filtros}>
                            <div>
                                <label htmlFor="fecha-select">Seleccione día</label>
                                <div className={styles.fecha_select_input}>
                                    <input
                                        type="date"
                                        id="fecha-select"
                                        name="fecha"
                                        value={selectedFecha}
                                        onChange={(e) => setSelectedFecha(e.target.value)}
                                    />
                                    <i
                                        className="fas fa-trash"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setSelectedFecha("")}
                                    ></i>
                                </div>

                            </div>
                            <div>
                                <label htmlFor="balsa-select">Balsa</label>
                                <select value={selectedBalsa} onChange={handleBalsaChange}>
                                    <option value="all">Todas</option>
                                    {balsas.map((balsa) => (
                                        <option key={balsa} value={balsa}>
                                            {`Balsa ${balsa}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="contador-select">Contador</label>

                                <div className={styles.peticiones_lectura_wrapper}>
                                    <input
                                        type="text"
                                        id="contador-select"
                                        placeholder="Buscar contador"
                                        value={filtroContador}
                                        onChange={(e) => setFiltroContador(e.target.value)}
                                        onFocus={() => setShowDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                        className={styles.peticiones_lectura_input}
                                    />
                                    {showDropdown && (
                                        <ul className={`${styles.peticiones_lectura_lista} custom_scrollbar`} >
                                            <li
                                                key="all"
                                                onMouseDown={() => handleContadorChange("all")}
                                                className={styles.peticiones_lectura_item}
                                            >
                                                Todos
                                            </li>
                                            {filteredContadores.map((c) => (
                                                <li
                                                    key={c.ideEle}
                                                    onMouseDown={() => handleContadorChange(c.ideEle)}
                                                    className={styles.peticiones_lectura_item}
                                                >
                                                    {c.ideEle}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </div>

                            <button>
                                <i className="fas fa-folder-open"></i>Exportar a Excel
                            </button>
                        </div>
                        <div className={`${styles.tabla} custom_scrollbar`}>
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
                                            <td
                                                colSpan="9"
                                                style={{ textAlign: "center", padding: "20px" }}
                                            >
                                                No hay datos disponibles para las opciones seleccionadas
                                            </td>
                                        </tr>
                                    ) : (
                                        peticiones.map((item, i) => (
                                            <tr key={i}>
                                                <td>
                                                    {new Date(item.fecha).toLocaleString("es-ES", {
                                                        timeZone: "Europe/Madrid",
                                                    })}
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{usuariosMap[item.requester] || item.requester}</td>
                                                <td>{usuariosMap[item.assignedTo] || item.assignedTo}</td>
                                                <td>{item.priority}</td>
                                                <td>{item.status}</td>
                                                <td>{tiposMap[item.type]}</td>
                                                <td>
                                                    <span
                                                        onClick={() =>
                                                            openPopup(
                                                                "Comentario",
                                                                <div style={{ padding: "20px" }}>
                                                                    {item.comments}
                                                                </div>
                                                            )
                                                        }
                                                        className={styles.ver_mas}
                                                    >
                                                        <i className="fas fa-align-left"></i>Ver más
                                                    </span>
                                                </td>
                                                <td>
                                                    <i className="fas fa-edit"></i>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className={styles.grafica_contenedor}>
                    <div id="grafica-lecturas" className={styles.grafica}></div>
                </div>

                <div className={`${styles.lecturas}`}>
                    <div className={`${styles.titulo_pestania}`}>
                        LECTURAS DE CONTADORES
                    </div>
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
                                    <td>
                                        {selectedContador !== "all" ? selectedContador : "Selecciona uno"}
                                    </td>
                                    <td>
                                        <input type="datetime-local" value={nuevaLectura.fecha} onChange={(e) => setNuevaLectura({ ...nuevaLectura, fecha: e.target.value })} />
                                    </td>
                                    <td>
                                        <input type="text" value={nuevaLectura.usuario} onChange={(e) => setNuevaLectura({ ...nuevaLectura, usuario: e.target.value })} />
                                    </td>
                                    <td>
                                        <input type="text" value={nuevaLectura.volumen} onChange={(e) => setNuevaLectura({ ...nuevaLectura, volumen: e.target.value })} />
                                    </td>
                                    <td>
                                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
                                        <button onClick={handleFileButtonClick}>Subir archivo</button>
                                    </td>
                                    <td>
                                        <i className="fas fa-plus" style={{ cursor: "pointer" }} onClick={subirLectura}></i>
                                    </td>
                                </tr>

                                {lecturas.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            style={{ textAlign: "center", padding: "20px" }}
                                        >
                                            No hay datos disponibles para las opciones seleccionadas
                                        </td>
                                    </tr>
                                ) : (
                                    lecturas.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.contador}</td>
                                            <td>
                                                {new Date(item.fecha).toLocaleString("es-ES", {
                                                    timeZone: "Europe/Madrid",
                                                })}
                                            </td>
                                            <td>{usuariosMap[item.usuario] || item.usuario}</td>
                                            <td>{item.volumen}</td>
                                            <td>
                                                <span
                                                    onClick={() => {
                                                        if (!item.imagen) {
                                                            openPopup(
                                                                "Sin imagen",
                                                                <p>No se ha subido ninguna imagen para esta lectura.</p>
                                                            );
                                                            return;
                                                        }
                                                        if (!item.imagen.startsWith("data:image/jpeg;base64,")) {
                                                            openPopup(
                                                                "Error",
                                                                <p>No se puede mostrar la imagen: formato inválido.</p>
                                                            );
                                                            return;
                                                        }
                                                        openPopup(
                                                            "Imagen de lectura",
                                                            <img
                                                                src={item.imagen}
                                                                alt="Imagen de lectura"
                                                                className={styles.imagen_lecturas_popup}
                                                            />
                                                        );
                                                    }}
                                                    className={styles.ver_mas}
                                                >
                                                    <i className="fas fa-image"></i>Ver imagen
                                                </span>
                                            </td>
                                            <td>
                                                <i className="fas fa-edit"></i>
                                            </td>
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

            </div>
            <PopupConfig
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={popupTitle}
                width="600px"
                height="auto"
            >
                <div style={{ textAlign: "center" }}>{popupContent}</div>
            </PopupConfig>
        </>
    );
}

export default GestionLecturas;
