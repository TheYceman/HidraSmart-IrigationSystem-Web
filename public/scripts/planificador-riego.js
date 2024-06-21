const sector = document.getElementById("sector-dropdown");
const tipoElemento = document.getElementById("tipo-dropdown");
const fechaInicio = document.getElementById("fecha-inicio");
const fechaInicioLectura = document.getElementById("fecha-inicio-lectura");
const fechaInicioControl = document.getElementById("fecha-inicio-control");
const fechaFinControl = document.getElementById("fecha-fin-control");
const fechaFin = document.getElementById("fecha-fin");
const elementsList = document.querySelector("#lista-elementos ul");
let selectedElements = [];



document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.querySelector('#contadores'); // Selecciona el elemento <select> por su ID

    if (selectElement) {
        const firstOption = selectElement.querySelector('option'); // Selecciona el primer <option> dentro del <select>

        if (firstOption) {
            firstOption.selected = true; // Selecciona el primer <option>
            addToSelectedList(firstOption); // Agrega el primer <option> a la lista de elementos seleccionados
        }
    }

    //Añade la primera opción a la lista de contadores seleccionados de lectura
    const selectElementLectura = document.querySelector('#contadoresLectura'); // Selecciona el elemento <select> por su ID

    if (selectElementLectura) {
        const firstOption = selectElement.querySelector('option'); // Selecciona el primer <option> dentro del <select>

        if (firstOption) {
            firstOption.selected = true; // Selecciona el primer <option>
            addToSelectedListLectura(firstOption); // Agrega el primer <option> a la lista de elementos seleccionados
        }
    }

    // Obtener la fecha actual en el formato requerido por datetime-local (YYYY-MM-DDTHH:MM)
    const today = new Date().toISOString().slice(0, 16);

    // Convertir la fecha a una cadena en formato ISO y tomar los primeros 16 caracteres (YYYY-MM-DDTHH:MM)
    // Obtener la fecha actual y sumarle un día
    const today2 = new Date();
    today2.setDate(today2.getDate() + 1);
    const tomorrow = today2.toISOString().slice(0, 16);


    // Asignar la fecha de 2020 como valor por defecto al campo fecha-inicio
    fechaInicio.value = today;
    fechaInicioLectura.value = today;
    fechaInicioControl.value = today;
    fechaFinControl.value = tomorrow;

    paintGraph();

});

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

    }

    if (seriesData.length === 0) {
        var fecha1 = new Date("2024-05-23 00:00:00").getTime();
        var fecha2 = new Date("2024-05-24 00:00:00").getTime();
        var fecha3 = new Date("2024-05-25 00:00:00").getTime();
        var fecha4 = new Date("2024-05-26 00:00:00").getTime();


        // Suponiendo que tienes los datos de esta manera
        var datos = [
            { "instante": fecha1, "valor": 15 },
            { "instante": fecha2, "valor": 15 },
            { "instante": fecha3, "valor": 15 }, // Agregar una hora al inicio
            { "instante": fecha4, "valor": 15 }  // Agregar dos horas al inicio
        ];

        // Transforma los datos al formato que Highcharts espera
        seriesData = datos.map(function (dato) {
            return [dato.instante, dato.valor];
        });
        console.log(seriesData);
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
                    text: "Valor",
                }
            },
            {
                title: {
                    text: "Valor",
                },
                opposite: true,
            },
        ],
        series: [{
            name: 'Datos',
            data: seriesData
        }],
        turboThreshold: 5000,
    };
    Highcharts.chart("highchart-graph", chartOptions);
}

paintGraph();

function dateToObject(date) {
    return new Date(date + ":00Z");
}

async function paintGraphLectura() {

    let seriesData = [];

    if (seriesData.length === 0) {
        var fecha1 = new Date("2024-06-21 00:00:00").getTime();

        // Suponiendo que tienes los datos de esta manera
        var datos = [
            { "instante": fecha1, "valor": 1 },
        ];

        // Transforma los datos al formato que Highcharts espera
        seriesData = datos.map(function (dato) {
            return [dato.instante, dato.valor];
        });
        console.log(seriesData);
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
                    text: "Número peticiones",
                }
            }
        ],
        series: [{
            name: 'Datos',
            data: seriesData
        }],
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

function updateElements() {

}

