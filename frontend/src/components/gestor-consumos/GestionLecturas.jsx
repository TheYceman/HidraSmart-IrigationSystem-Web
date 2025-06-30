import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";

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
    fetchTiposPeticiones,
    fetchUsuarios
} from "../../api/gestion-lectura-api.js";

function GestionLecturas() {
    // Fecha
    const [selectedFecha, setSelectedFecha] = useState("");

    // Balsas
    const [balsas, setBalsas] = useState([]);

    // Contadores
    const [contadores, setContadores] = useState([]);
    const [filtroContador, setFiltroContador] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // Memoriza el resultado de filtrar contadores en base al texto introducido en el input de búsqueda.
    // Se recalcula solo cuando cambian los contadores disponibles o el texto del filtro.
    const filteredContadores = useMemo(() => {
        return contadores.filter(c =>
            // Para cada contador, revisa si el campo 'ideEle' contiene
            // el texto escrito en el filtro (ignorando mayúsculas/minúsculas)
            c.ideEle?.toLowerCase().includes(filtroContador.toLowerCase())
        );
    }, [contadores, filtroContador]); // Solo se recalcula cuando cambia la lista de contadores o el texto del filtro.

    // Filtros en la tabla de peticiones
    const [filtroPrioridad, setFiltroPrioridad] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    // Peticiones
    const [peticiones, setPeticiones] = useState([]);
    const [selectedBalsa, setSelectedBalsa] = useState("all");

    //Tipos peticiones
    const [tiposMap, setTiposMap] = useState({});
    const [tiposUnicos, setTiposUnicos] = useState([]);

    // Cargar filtros para la tabla peticiones
    const prioridadesDisponibles = ["Alta", "Media", "Baja"];
    const estadosDisponibles = ["Pendiente", "Aprobada", "Asignada", "Rechazada"];


    // Lecturas
    const [lecturas, setLecturas] = useState([]);
    const [selectedContador, setSelectedContador] = useState("all");

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

    // Editar peticiones y lecturas
    const [peticionEditandoId, setPeticionEditandoId] = useState(null);
    const [lecturaEditandoId, setLecturaEditandoId] = useState(null);

    const [datosEditPeticion, setDatosEditPeticion] = useState({});
    const [datosEditLectura, setDatosEditLectura] = useState({});

    const [usuariosAsignables, setUsuariosAsignables] = useState([]);

    /**
     * Carga los nombres de los usuarios cuyos IDs se pasan como parámetro
     * y los almacena en el estado `usuariosMap`.
     * @param {string[]} ids IDs de los usuarios a cargar
     */
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

    const cargarTiposPeticion = async () => {
        const tipos = await fetchTiposPeticiones(selectedBalsa);
        console.log("🔍 Tipos cargados desde API:", tipos);

        const nuevoMap = {};
        const nombresUnicos = new Set();

        tipos.forEach(tipo => {
            // Adaptamos el mapeo usando los nombres reales de los campos
            nuevoMap[tipo.idtipo] = tipo.Descripcion;
            if (tipo.Descripcion) {
                nombresUnicos.add(tipo.Descripcion);
            }
        });

        setTiposMap(nuevoMap);
        setTiposUnicos([...nombresUnicos].sort());
    };

    /**
     * Simula un click en el input file para que el usuario pueda seleccionar
     * una imagen para subir.
     */
    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    /**
     * Maneja los cambios en el campo de entrada de imagen.
     * Lee el archivo seleccionado y actualiza el estado `imagenBase64` si el tamaño
     * del archivo está dentro del límite permitido (1 MB).
     * Si el archivo supera 1 MB, se muestra un popup de error.
     *
     * @param {Event} e - Evento generado por el cambio en el input de tipo archivo.
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 1024 * 1024) { // 1 MB
            openPopup("Advertencia", <p>La imagen no debe superar 1 MB.</p>);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevaLectura((prev) => ({ ...prev, imagenBase64: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    /**
     * Sube una lectura a la base de datos y actualiza el estado
     * con las lecturas recargadas.
     * Muestra un popup de éxito o error según sea el caso.
     * Limpia los campos para crear una nueva lectura.
     */
    const subirLectura = async () => {
        if (selectedContador === "all") {
            openPopup("Advertencia", <p>Debes seleccionar un contador específico.</p>);
            return;
        }

        const datosLectura = {
            contador: selectedContador,
            fecha: nuevaLectura.fecha,
            usuario: nuevaLectura.usuario,
            volumen: parseFloat(nuevaLectura.volumen),
            imagen: nuevaLectura.imagenBase64
        };

        try {
            await axios.post(`/api/is-b${selectedBalsa}/lecturas`, datosLectura);
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
     * Función manejadora para el cambio de la balsa seleccionada.
     * 
     * Actualiza el estado de la balsa seleccionada y obtiene las peticiones y contadores
     * relacionados en función del valor seleccionado.
     * 
     * @param {Event} e - Evento generado por el cambio en el select de balsa.
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
     * Función manejadora para el cambio del contador seleccionado.
     * 
     * Actualiza el estado del contador seleccionado y obtiene las lecturas relacionadas
     * en función del valor seleccionado.
     * Si se selecciona "all", se obtienen todas las lecturas para la balsa seleccionada.
     * Si se selecciona un contador específico, se obtienen solo las lecturas de ese contador.
     * 
     * @param {string} contadorValue - Valor del contador seleccionado por el usuario.
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

    const formatearFechaMadrid = (fecha) => {
        const formatter = new Intl.DateTimeFormat("es-ES", {
            timeZone: "Europe/Madrid",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });

        return formatter.format(new Date(fecha)).replace(",", "");
    };

    /**
     * Exporta las peticiones y lecturas de la balsa seleccionada (o todas las balsas)
     * a un archivo zip con hojas de cálculo xlsx, una por balsa.
     * Las hojas de cálculo se llaman "Peticiones" y "Lecturas".
     */
    const handleExportZipPorBalsa = async () => {
        // Importación dinámica de las librerías necesarias solo cuando se ejecuta la exportación
        const JSZip = (await import("jszip")).default;
        const XLSX = await import("xlsx");
        const FileSaver = await import("file-saver");

        // Crear un nuevo archivo ZIP donde se incluirán los Excel por balsa
        const zip = new JSZip();

        // Determinar qué balsas exportar: una específica o todas
        const balsasAExportar = selectedBalsa === "all" ? balsas : [selectedBalsa];

        // Obtener la fecha actual en formato de Madrid (UTC+2) y formatearla para el nombre del archivo
        const fechaActual = formatearFechaMadrid(new Date()).replace(" ", "_").replace(/:/g, "-");

        // Función para calcular el ancho de cada columna en función de su contenido
        const calculateColumnWidths = (data) => {
            const headers = Object.keys(data[0] || {});
            return headers.map((key) => {
                const maxLength = Math.max(
                    key.length,
                    ...data.map(row => String(row[key] || "").length)
                );
                return { wch: Math.min(maxLength + 2, 60) }; // Máximo de 60 caracteres (~450px)
            });
        };

        // Función para centrar horizontal y verticalmente el contenido de las cabeceras
        const centrarCabeceras = (ws, data) => {
            const headers = Object.keys(data[0] || {});
            headers.forEach((header, idx) => {
                const colLetter = XLSX.utils.encode_col(idx);
                const cellRef = `${colLetter}1`; // Referencia a la celda de cabecera (primera fila)
                if (ws[cellRef]) {
                    ws[cellRef].s = {
                        alignment: { horizontal: "center", vertical: "center", wrapText: true },
                        font: { bold: true }
                    };
                }
            });
        };

        // Recorrer todas las balsas a exportar
        for (const balsa of balsasAExportar) {
            // Filtrar las peticiones y lecturas correspondientes a la balsa actual
            const peticionesBalsa = peticionesFiltradas.filter(p => p.balsa === balsa);
            const lecturasBalsa = lecturas.filter(l => l.balsa === balsa);

            // Transformar los datos de peticiones en un formato adecuado para exportar
            const peticionesData = peticionesBalsa.map(p => ({
                Id: p.idPeticion,
                Fecha: formatearFechaMadrid(p.fecha),
                Nombre: p.name,
                Solicitante: usuariosMap[p.requester] || p.requester,
                Asignado: usuariosMap[p.assignedTo] || p.assignedTo,
                Prioridad: p.priority,
                Estado: p.status,
                Tipo: tiposMap[p.type],
                Comentario: p.comments
            }));

            // Transformar los datos de lecturas
            const lecturasData = lecturasBalsa.map(l => ({
                Id: l.idLectura,
                Contador: l.contador,
                Fecha: formatearFechaMadrid(l.fecha),
                Usuario: usuariosMap[l.usuario] || l.usuario,
                Volumen: l.volumen
            }));

            // Crear hoja de Excel para las peticiones
            const wsPeticiones = XLSX.utils.json_to_sheet(peticionesData);
            wsPeticiones["!cols"] = calculateColumnWidths(peticionesData); // Ajustar ancho de columnas
            centrarCabeceras(wsPeticiones, peticionesData); // Centrar cabeceras

            // Crear hoja de Excel para las lecturas
            const wsLecturas = XLSX.utils.json_to_sheet(lecturasData);
            wsLecturas["!cols"] = calculateColumnWidths(lecturasData);
            centrarCabeceras(wsLecturas, lecturasData);

            // Crear un nuevo libro de Excel y añadir ambas hojas
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, wsPeticiones, "Peticiones");
            XLSX.utils.book_append_sheet(wb, wsLecturas, "Lecturas");

            // Convertir el libro a un blob binario
            const wbBlob = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });

            // Añadir el archivo Excel al ZIP
            zip.file(`balsa_${balsa}.xlsx`, wbBlob);
        }

        // Generar el archivo ZIP completo con todas las balsas
        const zipBlob = await zip.generateAsync({ type: "blob" });

        // Guardar el archivo ZIP con un nombre que incluye la fecha
        FileSaver.saveAs(zipBlob, `datos_balsas_${fechaActual}.zip`);
    };

    // Filtros en la tabla de peticiones
    const peticionesFiltradas = peticiones.filter((p) => {
        const matchPrioridad = !filtroPrioridad || p.priority === filtroPrioridad;
        const matchEstado = !filtroEstado || p.status === filtroEstado;
        const matchTipo = !filtroTipo || tiposMap[p.type] === filtroTipo;
        return matchPrioridad && matchEstado && matchTipo;
    });

    //Editar peticiones y lecturas
    const iniciarEdicionPeticion = (peticion) => {
        setPeticionEditandoId(peticion.idPeticion);
        setDatosEditPeticion({ ...peticion });
    };

    const cancelarEdicionPeticion = () => {
        setPeticionEditandoId(null);
        setDatosEditPeticion({});
    };

    const confirmarEdicionPeticion = async (id) => {
        if (selectedBalsa === "all") {
            openPopup("Advertencia", <p>Debes seleccionar una balsa específica para editar una petición.</p>);
            return;
        }

        if (!datosEditPeticion.name || !datosEditPeticion.priority || !datosEditPeticion.status) {
            openPopup("Error", <p>Por favor completa todos los campos obligatorios.</p>);
            return;
        }

        try {
            await axios.put(`/api/is-b${selectedBalsa}/peticiones/${id}`, datosEditPeticion);

            openPopup("Petición actualizada", <p>La petición se ha actualizado correctamente.</p>);

            const datosActualizados = await fetchPeticiones(selectedBalsa, selectedFecha);
            setPeticiones(datosActualizados);

            // Recargar nombres de usuario para evitar "Cargando..."
            const nuevosIdsUsuarios = new Set();
            datosActualizados.forEach(p => {
                if (p.requester) nuevosIdsUsuarios.add(p.requester);
                if (p.assignedTo) nuevosIdsUsuarios.add(p.assignedTo);
            });
            await cargarUsuariosPorIds([...nuevosIdsUsuarios]);

            setPeticionEditandoId(null);
            setDatosEditPeticion({});
        } catch (err) {
            console.error("❌ Error al actualizar la petición:", err);
            openPopup("Error", <p>Ocurrió un error al actualizar la petición.</p>);
        }
    };

    const iniciarEdicionLectura = (lectura) => {
        setLecturaEditandoId(lectura.idLectura);
        setDatosEditLectura({ ...lectura });
    };

    const cancelarEdicionLectura = () => {
        setLecturaEditandoId(null);
        setDatosEditLectura({});
    };

    const confirmarEdicionLectura = async (id) => {
        if (selectedBalsa === "all") {
            openPopup("Advertencia", <p>Debes seleccionar una balsa específica para editar una lectura.</p>);
            return;
        }

        try {
            await axios.put(`/api/is-b${selectedBalsa}/lecturas/${id}`, datosEditLectura);

            openPopup("Lectura actualizada", <p>La lectura se ha actualizado correctamente.</p>);

            const datosActualizados = selectedContador === "all"
                ? await fetchLecturas(selectedBalsa, selectedFecha)
                : await fetchLecturasByContador(selectedBalsa, selectedContador, selectedFecha);

            setLecturas(datosActualizados);

            // Recargar nombre de usuario para evitar "Cargando..."
            const nuevosIdsUsuarios = [...new Set(datosActualizados.map(l => l.usuario))];
            await cargarUsuariosPorIds(nuevosIdsUsuarios);

            setLecturaEditandoId(null);
            setDatosEditLectura({});
        } catch (err) {
            console.error("❌ Error al actualizar la lectura:", err);
            openPopup("Error", <p>Ocurrió un error al actualizar la lectura.</p>);
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/scripts/gestor-consumos/gestion-lecturas.js";
        document.body.appendChild(script);

        const loadInitialData = async () => {
            const balsasDisponibles = await fetchBalsasDisponibles();
            setBalsas(balsasDisponibles);

            let todasPeticiones = [];
            let todasLecturas = [];

            if (selectedBalsa === "all") {
                for (const balsa of balsasDisponibles) {
                    const peticiones = await fetchPeticiones(balsa, selectedFecha);
                    todasPeticiones.push(...peticiones.map(p => ({ ...p, balsa })));

                    const lecturas = selectedContador === "all"
                        ? await fetchLecturas(balsa, selectedFecha)
                        : await fetchLecturasByContador(balsa, selectedContador, selectedFecha);
                    todasLecturas.push(...lecturas.map(l => ({ ...l, balsa })));
                }
            } else {
                const peticiones = await fetchPeticiones(selectedBalsa, selectedFecha);
                todasPeticiones = peticiones.map(p => ({ ...p, balsa: selectedBalsa }));

                const lecturas = selectedContador === "all"
                    ? await fetchLecturas(selectedBalsa, selectedFecha)
                    : await fetchLecturasByContador(selectedBalsa, selectedContador, selectedFecha);
                todasLecturas = lecturas.map(l => ({ ...l, balsa: selectedBalsa }));
            }

            setPeticiones(todasPeticiones);
            setLecturas(todasLecturas);

            const datosContadores = await fetchContadores(selectedBalsa);
            setContadores(datosContadores);

            const idsUsuarios = new Set();
            todasPeticiones.forEach(p => {
                if (p.requester) idsUsuarios.add(p.requester);
                if (p.assignedTo) idsUsuarios.add(p.assignedTo);
            });
            todasLecturas.forEach(l => {
                if (l.usuario) idsUsuarios.add(l.usuario);
            });

            await cargarUsuariosPorIds([...idsUsuarios]);

            await cargarTiposPeticion();

            const usuariosAsignables = await fetchUsuarios();
            setUsuariosAsignables(usuariosAsignables);
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
                                        className={`${styles.icon} fas fa-trash`}
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

                            <button className={`${styles.btn}`} onClick={handleExportZipPorBalsa}>
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
                                        <th className={styles.th_filtrable}>
                                            Prioridad <i className="fas fa-sort"></i>
                                            <div className={styles.filtro_dropdown}>
                                                <select value={filtroPrioridad} onChange={(e) => setFiltroPrioridad(e.target.value)}>
                                                    <option value="">Todas</option>
                                                    {prioridadesDisponibles.map(p => (
                                                        <option key={p} value={p}>{p}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </th>
                                        <th className={styles.th_filtrable}>
                                            Estado <i className="fas fa-sort"></i>
                                            <div className={styles.filtro_dropdown}>
                                                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                                    <option value="">Todos</option>
                                                    {estadosDisponibles.map(e => (
                                                        <option key={e} value={e}>{e}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </th>
                                        <th className={styles.th_filtrable}>
                                            Tipo <i className="fas fa-sort"></i>
                                            <div className={styles.filtro_dropdown}>
                                                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                                                    <option value="">Todos</option>
                                                    {tiposUnicos.map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </th>
                                        <th>Comentario</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {peticionesFiltradas.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                                                No hay datos disponibles para las opciones seleccionadas
                                            </td>
                                        </tr>
                                    ) : (
                                        peticionesFiltradas.map((item, i) => (
                                            <tr key={i}>
                                                <td>
                                                    {new Date(item.fecha).toLocaleString("es-ES", {
                                                        timeZone: "Europe/Madrid",
                                                    })}
                                                </td>
                                                <td>
                                                    {peticionEditandoId === item.idPeticion ? (
                                                        <input
                                                            value={datosEditPeticion.name || ""}
                                                            onChange={e =>
                                                                setDatosEditPeticion({ ...datosEditPeticion, name: e.target.value })
                                                            }
                                                        />
                                                    ) : (
                                                        item.name
                                                    )}
                                                </td>

                                                <td>{usuariosMap[item.requester] || 'Cargando...'}</td>

                                                <td>
                                                    {peticionEditandoId === item.idPeticion ? (
                                                        <select
                                                            value={datosEditPeticion.assignedTo || ""}
                                                            onChange={e =>
                                                                setDatosEditPeticion({ ...datosEditPeticion, assignedTo: e.target.value })
                                                            }
                                                            required
                                                        >
                                                            <option value="" defaultValue disabled>Selecciona</option>
                                                            {usuariosAsignables.map(user => (
                                                                <option key={user.idusers} value={user.idusers}>
                                                                    {user.username}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        usuariosMap[item.assignedTo] || 'Cargando...'
                                                    )}
                                                </td>

                                                <td>
                                                    {peticionEditandoId === item.idPeticion ? (
                                                        <select
                                                            value={datosEditPeticion.priority || ""}
                                                            onChange={e =>
                                                                setDatosEditPeticion({ ...datosEditPeticion, priority: e.target.value })
                                                            }
                                                            required
                                                        >
                                                            <option value="" defaultValue disabled>Selecciona</option>
                                                            {prioridadesDisponibles.map(op => (
                                                                <option key={op} value={op}>{op}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        item.priority
                                                    )}
                                                </td>

                                                <td>
                                                    {peticionEditandoId === item.idPeticion ? (
                                                        <select
                                                            value={datosEditPeticion.status || ""}
                                                            onChange={e =>
                                                                setDatosEditPeticion({ ...datosEditPeticion, status: e.target.value })
                                                            }
                                                            required
                                                        >
                                                            <option value="" defaultValue disabled>Selecciona</option>
                                                            {estadosDisponibles.map(op => (
                                                                <option key={op} value={op}>{op}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        item.status
                                                    )}
                                                </td>

                                                <td>
                                                    {peticionEditandoId === item.idPeticion ? (
                                                        <select
                                                            value={tiposMap[datosEditPeticion.type] || ""}
                                                            onChange={e => {
                                                                const entrada = Object.entries(tiposMap).find(([, v]) => v === e.target.value);
                                                                const tipoKey = entrada?.[0] || "";
                                                                setDatosEditPeticion({ ...datosEditPeticion, type: tipoKey });
                                                            }}
                                                            required
                                                        >
                                                            <option value="" defaultValue disabled>Selecciona</option>
                                                            {tiposUnicos.map(op => (
                                                                <option key={op} value={op}>{op}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        tiposMap[item.type] || 'Cargando...'
                                                    )}
                                                </td>

                                                <td>
                                                    {peticionEditandoId === item.idPeticion ? (
                                                        <textarea
                                                            value={datosEditPeticion.comments || ""}
                                                            onChange={e =>
                                                                setDatosEditPeticion({ ...datosEditPeticion, comments: e.target.value })
                                                            }
                                                        />
                                                    ) : (
                                                        <span
                                                            onClick={() =>
                                                                openPopup(
                                                                    "Comentario",
                                                                    <div style={{ padding: "20px" }}>{item.comments}</div>
                                                                )
                                                            }
                                                            className={styles.ver_mas}
                                                        >
                                                            <i className="fas fa-align-left"></i>Ver más
                                                        </span>
                                                    )}
                                                </td>

                                                <td className={styles.action_buttons}>
                                                    {peticionEditandoId === item.idPeticion ? (
                                                        <>
                                                            <button className={`${styles.btn}`} onClick={() => confirmarEdicionPeticion(item.idPeticion)}>
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button className={`${styles.btn}`} onClick={() => cancelarEdicionPeticion()}>
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className={`${styles.btn}`} onClick={() => iniciarEdicionPeticion(item)}>
                                                            <i className="fas fa-pen"></i>
                                                        </button>
                                                    )}
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
                                        <button className={`${styles.btn}`} onClick={handleFileButtonClick}>Subir archivo</button>
                                    </td>
                                    <td>
                                        <i className={`${styles.icon} fas fa-plus`} onClick={subirLectura}></i>
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
                                            <td>
                                                {lecturaEditandoId === item.idLectura ? (
                                                    <select
                                                        value={datosEditLectura.contador || ""}
                                                        onChange={e => setDatosEditLectura({ ...datosEditLectura, contador: e.target.value })}
                                                        required
                                                    >
                                                        <option value="" disabled>Selecciona</option>
                                                        {filteredContadores.map(c => (
                                                            <option key={c.ideEle} value={c.ideEle}>
                                                                {c.ideEle}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    item.contador
                                                )}
                                            </td>

                                            <td>
                                                {new Date(item.fecha).toLocaleString("es-ES", {
                                                    timeZone: "Europe/Madrid",
                                                })}
                                            </td>

                                            <td>
                                                {lecturaEditandoId === item.idLectura ? (
                                                    <select
                                                        value={datosEditLectura.usuario || ""}
                                                        onChange={e => setDatosEditLectura({ ...datosEditLectura, usuario: parseInt(e.target.value) })}
                                                        required
                                                    >
                                                        <option value="" defaultValue disabled>Selecciona</option>
                                                        {usuariosAsignables.map(user => (
                                                            <option key={user.idusers} value={user.idusers}>
                                                                {user.username}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    usuariosMap[item.usuario] || 'Cargando...'
                                                )}
                                            </td>

                                            <td>
                                                {lecturaEditandoId === item.idLectura ? (
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={datosEditLectura.volumen || ""}
                                                        onChange={e => setDatosEditLectura({ ...datosEditLectura, volumen: e.target.value })}
                                                    />
                                                ) : (
                                                    item.volumen
                                                )}
                                            </td>

                                            <td>
                                                {lecturaEditandoId === item.idLectura ? (
                                                    datosEditLectura.imagen ? (
                                                        <span
                                                            onClick={() => {
                                                                openPopup("Editor de imagen", (
                                                                    <div>
                                                                        <img
                                                                            src={datosEditLectura.imagen}
                                                                            alt="Imagen de lectura"
                                                                            className={styles.imagen_lecturas_popup}
                                                                        />
                                                                        <br />
                                                                        <div className={styles.w_full}>
                                                                            <button className={`${styles.btn}`} onClick={() => {
                                                                                const input = document.createElement('input');
                                                                                input.type = 'file';
                                                                                input.accept = 'image/jpeg';

                                                                                input.onchange = e => {
                                                                                    const file = e.target.files[0];
                                                                                    if (file && file.size > 1024 * 1024) {
                                                                                        openPopup("Advertencia", <p>La imagen no debe superar 1 MB.</p>);
                                                                                        return;
                                                                                    }

                                                                                    const reader = new FileReader();
                                                                                    reader.onloadend = () => {
                                                                                        setDatosEditLectura(prev => ({
                                                                                            ...prev,
                                                                                            imagen: reader.result
                                                                                        }));
                                                                                        setIsPopupOpen(false);
                                                                                    };
                                                                                    reader.readAsDataURL(file);
                                                                                };

                                                                                input.click();
                                                                            }}>Reemplazar imagen</button>
                                                                        </div>
                                                                    </div>
                                                                ));
                                                            }}
                                                            className={styles.ver_mas}
                                                        >
                                                            <i className="fas fa-edit"></i>Abrir editor de imagen
                                                        </span>
                                                    ) : (
                                                        <button className={`${styles.btn}`} onClick={() => {
                                                            const input = document.createElement('input');
                                                            input.type = 'file';
                                                            input.accept = 'image/jpeg';

                                                            input.onchange = e => {
                                                                const file = e.target.files[0];
                                                                if (file && file.size > 1024 * 1024) {
                                                                    openPopup("Advertencia", <p>La imagen no debe superar 1 MB.</p>);
                                                                    return;
                                                                }

                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setDatosEditLectura(prev => ({
                                                                        ...prev,
                                                                        imagen: reader.result
                                                                    }));
                                                                };
                                                                reader.readAsDataURL(file);
                                                            };

                                                            input.click();
                                                        }}>
                                                            <i className="fas fa-upload"></i> Subir imagen
                                                        </button>
                                                    )
                                                ) : (
                                                    item.imagen ? (
                                                        <span
                                                            onClick={() => {
                                                                openPopup("Imagen de lectura", (
                                                                    <img
                                                                        src={item.imagen}
                                                                        alt="Imagen de lectura"
                                                                        className={styles.imagen_lecturas_popup}
                                                                    />
                                                                ));
                                                            }}
                                                            className={styles.ver_mas}
                                                        >
                                                            <i className="fas fa-image"></i>Ver imagen
                                                        </span>
                                                    ) : (
                                                        <span className={styles.sin_imagen}>Sin imagen</span>
                                                    )
                                                )}
                                            </td>

                                            <td className={styles.action_buttons}>
                                                {lecturaEditandoId === item.idLectura ? (
                                                    <>
                                                        <button className={`${styles.btn}`} onClick={() => confirmarEdicionLectura(item.idLectura)}>
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button className={`${styles.btn}`} onClick={cancelarEdicionLectura}>
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className={`${styles.btn}`} onClick={() => iniciarEdicionLectura(item)}>
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                )}
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
