const sector = document.getElementById("sector-dropdown");
const tipoElemento = document.getElementById("tipo-dropdown");
const fechaInicio = document.getElementById("fecha-inicio");
const fechaFin = document.getElementById("fecha-fin");
const elementsList = document.querySelector("#lista-elementos ul");
let selectedElements = [];

Highcharts.setOptions({
    chart: {
        backgroundColor: '#cfcfcf',
    },
    lang: {
        loading: "Cargando...",
        months: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ],
        weekdays: [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
        ],
        shortMonths: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
        ],
        exportButtonTitle: "Exportar",
        printButtonTitle: "Importar",
        rangeSelectorFrom: "Desde",
        rangeSelectorTo: "Hasta",
        rangeSelectorZoom: "Período",
        downloadPNG: "Descargar imagen PNG",
        downloadJPEG: "Descargar imagen JPEG",
        downloadPDF: "Descargar imagen PDF",
        downloadSVG: "Descargar imagen SVG",
        printChart: "Imprimir",
        resetZoom: "Reiniciar zoom",
        resetZoomTitle: "Reiniciar zoom",
        thousandsSep: ",",
        decimalPoint: ".",
        viewFullscreen: "Ver en pantalla completa",
        exitFullscreen: "Salir de pantalla completa",
        backgroundColor: "blue",
    },
    global: { useUTC: false },
});

async function paintGraph() {
    //let elements = Array.from(document.getElementById("contadores").querySelectorAll("option:checked"));
    var elementsList = document.getElementById("selected-elements");
    var selectedOptions = elementsList.querySelectorAll(".selected-element");
    var elements = Array.from(selectedOptions).map(option => option.textContent);
    let seriesData = [];
    let tablaData = [];
    for (element of elements) {
        let data = await loadData({
            idSensor: element.id,
            tipo: "caudalimetro",
            //tipo: element.dataset.tipo,
        });
        let highcharData = [];
        for (d of data) {
            let valor;
            switch (element.dataset.tipo) {
                case "nivel":
                    valor = d.altura;
                    break;
                case "presion":
                    valor = d.presion;
                    break;
                case "caudalimetro":
                    valor = d.caudal;
                    break;
                case "valvula":
                    valor = d.estado;
                    break;
            }
            highcharData.push([d.instante, valor]);

            const valorTiempo = d.instante // Tu valor de tiempo en milisegundos

            // Crea un objeto Date a partir del valor de tiempo
            const fecha = new Date(valorTiempo);

            // Obtiene los componentes de la fecha
            const dia = fecha.getDate();
            const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, así que agregamos 1
            const año = fecha.getFullYear();
            const horas = fecha.getHours();
            const minutos = fecha.getMinutes();

            // Formatea la fecha y hora en el formato deseado
            const fechaFormateada = `${dia}-${mes}-${año} ${horas}:${minutos}`;

            tablaData.push({ "elemento": element.id, "instante": fechaFormateada, "valor": valor });
        }
        highcharData.sort(function (a, b) {
            return a[0] - b[0];
        });
        seriesData.push({
            name: element.id,
            data: highcharData,
            yAxis: ["caudalimetro", "presion"].includes(element.tipo) ? 1 : 0,
        });


        // Obtén la referencia a la tabla
        const tabla = document.getElementById('tablaDatos');

        // Limpia la tabla (opcional)
        tabla.innerHTML = ' <thead><tr><th>Elemento</th><th>Fecha</th><th>Valor</th></tr></thead>';

        // Crea las filas de la tabla con los datos cargados
        tablaData.forEach(function (dato) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
          <td>${dato.elemento}</td>
          <td>${dato.instante}</td>
          <td>${dato.valor}</td>
        `;
            tabla.appendChild(fila);
        });

    }

    var chartOptions = {
        chart: {
            type: "line",
        },
        credits: {
            enabled: false,
        },
        title: {
            text: "Gráfico de peticiones",
        },
        xAxis: {
            type: "datetime",
            title: {
                text: "Fecha",
            },
        },
        yAxis: [
            {
                title: {
                    text: "Valor (0-10)",
                },
                min: 0,
                max: 10,
            },
            {
                title: {
                    text: "Valor (0-1000)",
                },
                opposite: true,
                min: 0,
                max: 1000,
            },
        ],
        series: seriesData,
        turboThreshold: 5000,
    };
    Highcharts.chart("highchart-graph", chartOptions);
}

paintGraph();

async function paintGraphLectura() {
    //let elements = Array.from(document.getElementById("contadores").querySelectorAll("option:checked"));
    var elementsList = document.getElementById("selected-elements");
    var selectedOptions = elementsList.querySelectorAll(".selected-element");
    var elements = Array.from(selectedOptions).map(option => option.textContent);
    let seriesData = [];
    let tablaData = [];
    for (element of elements) {
        let data = await loadData({
            idSensor: element.id,
            tipo: "caudalimetro",
            //tipo: element.dataset.tipo,
        });
        let highcharData = [];
        for (d of data) {
            let valor;
            switch (element.dataset.tipo) {
                case "nivel":
                    valor = d.altura;
                    break;
                case "presion":
                    valor = d.presion;
                    break;
                case "caudalimetro":
                    valor = d.caudal;
                    break;
                case "valvula":
                    valor = d.estado;
                    break;
            }
            highcharData.push([d.instante, valor]);

            const valorTiempo = d.instante // Tu valor de tiempo en milisegundos

            // Crea un objeto Date a partir del valor de tiempo
            const fecha = new Date(valorTiempo);

            // Obtiene los componentes de la fecha
            const dia = fecha.getDate();
            const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, así que agregamos 1
            const año = fecha.getFullYear();
            const horas = fecha.getHours();
            const minutos = fecha.getMinutes();

            // Formatea la fecha y hora en el formato deseado
            const fechaFormateada = `${dia}-${mes}-${año} ${horas}:${minutos}`;

            tablaData.push({ "elemento": element.id, "instante": fechaFormateada, "valor": valor });
        }
        highcharData.sort(function (a, b) {
            return a[0] - b[0];
        });
        seriesData.push({
            name: element.id,
            data: highcharData,
            yAxis: ["caudalimetro", "presion"].includes(element.tipo) ? 1 : 0,
        });


        // Obtén la referencia a la tabla
        const tabla = document.getElementById('tablaDatos');

        // Limpia la tabla (opcional)
        tabla.innerHTML = ' <thead><tr><th>Elemento</th><th>Fecha</th><th>Valor</th></tr></thead>';

        // Crea las filas de la tabla con los datos cargados
        tablaData.forEach(function (dato) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
          <td>${dato.elemento}</td>
          <td>${dato.instante}</td>
          <td>${dato.valor}</td>
        `;
            tabla.appendChild(fila);
        });

    }

    var chartOptions = {
        chart: {
            type: "line",
        },
        credits: {
            enabled: false,
        },
        title: {
            text: "Gráfico de peticiones",
        },
        xAxis: {
            type: "datetime",
            title: {
                text: "Fecha",
            },
        },
        yAxis: [
            {
                title: {
                    text: "Valor (0-10)",
                },
                min: 0,
                max: 10,
            },
            {
                title: {
                    text: "Valor (0-1000)",
                },
                opposite: true,
                min: 0,
                max: 1000,
            },
        ],
        series: seriesData,
        turboThreshold: 5000,
    };
    Highcharts.chart("highchart-graph-lectura", chartOptions);
}

paintGraphLectura();


// Añadir evento clic al botón "Añadir Turno"
document.getElementById("btnAddTurno").addEventListener("click", function () {
    // Lógica para añadir turno aquí
    console.log("Se ha hecho clic en el botón 'Añadir Turno'");
});

// Añadir evento clic al botón "Actualizar"
document.getElementById("btnActualizar").addEventListener("click", function () {
    // Lógica para actualizar aquí
    console.log("Se ha hecho clic en el botón 'Actualizar'");
});

// Añadir evento clic al botón "SmartMap"
document.getElementById("btnSmartMap").addEventListener("click", function () {
    // Lógica para SmartMap aquí
    console.log("Se ha hecho clic en el botón 'SmartMap'");
});

// Añadir evento clic al botón "Añadir Turno"
document.getElementById("btnAddLectura").addEventListener("click", function () {
    // Lógica para añadir turno aquí
    console.log("Se ha hecho clic en el botón 'Añadir lectura'");
});

// Añadir evento clic al botón "Actualizar"
document.getElementById("btnPeticion").addEventListener("click", function () {
    // Lógica para actualizar aquí
    console.log("Se ha hecho clic en el botón 'Petición'");
});

// Añadir evento clic al botón "SmartMap"
document.getElementById("btnSmartMapLectura").addEventListener("click", function () {
    // Lógica para SmartMap aquí
    console.log("Se ha hecho clic en el botón 'btnSmartMapLectura'");
});

// Box 3
async function loadData(params) {
    //alert ("loadData " + params);
    params.fechaInicio = dateToObject(fechaInicio.value).toISOString();
    params.fechaFin = dateToObject(fechaInicio.value).toISOString();
    //params.fechaInicio = dateToObject(fechaInicio.value).toISOString();
    //params.fechaFin = dateToObject(fechaFin.value).toISOString();
    const response = await fetch(
        "/planificador-riego/data?" + new URLSearchParams(params)
    );
    const data = await response.json();
    console.log(data);
    for (d of data) {
        d.instante = new Date(d.instante).getTime();
    }
    return data;
}

function dateToObject(date) {
    return new Date(date + ":00Z");
}

function updateTime(element) {
    if (element.id === "fecha-inicio") {
        fechaFin.setAttribute("min", element.value);
    } else if (element.id === "fecha-fin") {
        fechaInicio.setAttribute("max", element.value);
    }
}


function addToSelectedList() {
    var select = document.getElementById("contadores");
    var selectedOption = select.options[select.selectedIndex];
    var selectedElementsList = document.getElementById("selected-elements");

    if (selectedOption && selectedOption.value) {
        // Crear un nuevo elemento de lista
        var listItem = document.createElement("li");
        listItem.className = "selected-element";
        listItem.textContent = selectedOption.text;

        // Añadir la opción para eliminar el elemento de la lista
        var deleteButton = document.createElement("span");
        deleteButton.className = "delete-element";
        deleteButton.textContent = "×";
        deleteButton.onclick = function () {
            listItem.remove();
        };
        listItem.appendChild(deleteButton);

        // Añadir el elemento de lista a la lista de elementos seleccionados
        selectedElementsList.appendChild(listItem);

        paintGraph();
    }
}

function addToSelectedListLectura() {
    var select = document.getElementById("contadoresLectura");
    var selectedOption = select.options[select.selectedIndex];
    var selectedElementsList = document.getElementById("selected-elements-lectura");

    if (selectedOption && selectedOption.value) {
        // Crear un nuevo elemento de lista
        var listItem = document.createElement("li");
        listItem.className = "selected-element";
        listItem.textContent = selectedOption.text;

        // Añadir la opción para eliminar el elemento de la lista
        var deleteButton = document.createElement("span");
        deleteButton.className = "delete-element";
        deleteButton.textContent = "×";
        deleteButton.onclick = function () {
            listItem.remove();
        };
        listItem.appendChild(deleteButton);

        // Añadir el elemento de lista a la lista de elementos seleccionados
        selectedElementsList.appendChild(listItem);

        paintGraphLectura();
    }
}

