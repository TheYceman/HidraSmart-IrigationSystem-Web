const sector = document.getElementById("sector-dropdown");
const tipoElemento = document.getElementById("tipo-dropdown");
const fechaInicio = document.getElementById("fecha-inicio");
const fechaFin = document.getElementById("fecha-fin");
const elementsList = document.querySelector("#lista-elementos ul");
let selectedElements = [];

Highcharts.setOptions({
  chart: {
    backgroundColor: "var(--color-bg-darker)",
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
/*
//Inicio Box 1
// Coordenadas


var arrayFiles = [
  {
    rute: "public/json/ge_caudalimetros.json",
    acronym: "cau",
    icon: "/public/images/icons/icon_flowmeters.png",
  },
  {
    rute: "public/json/ge_niveles.json",
    acronym: "niv",
    icon: "/public/images/icons/icon_water_level.png",
  },
  {
    rute: "public/json/ge_presiones.json",
    acronym: "pre",
    icon: "/public/images/icons/icon_pressure.png",
  },
  {
    rute: "public/json/ge_valvulas.json",
    acronym: "val",
    icon: "/public/images/icons/icon_valve_blue.png",
  },
];

//Inicio declaración de variables.
var datosGenerados;
var flowmetersArray = [],
  levelsArray = [],
  pressuresArray = [],
  valvesArray = [];
var arrayContainerElementsMap = [];
var arrayContainerElementsTables = [];
var arrayDataElements = [];
var makersElementsArray = [];

var sectorDropdown = document.getElementById("sectorDropdown");
var elementDropdown = document.getElementById("elementDropdown");
var listContainer = document.getElementById("listContainer");
var selectedListContainer = document.getElementById("selected-List-Container");
var addButton = document.getElementById("addButton");
var removeButton = document.getElementById("removeButton");
var selectedSubsectores = [];

var selectedSector = sectorDropdown.value;

// var selectedElements = elementDropdown.value;
//Fin declaración de variables.

// Evento 'change' del sectorDropdown
sectorDropdown.addEventListener("change", function () {
  var selectedSector = sectorDropdown.value;
  var selectedElements = elementDropdown.value;
  datosGenerados = get_data_element(selectedSector, selectedElements);
});

// Evento 'change' del elementDropdown
elementDropdown.addEventListener("change", function () {
  var selectedSector = sectorDropdown.value;
  var selectedElements = elementDropdown.value;
  datosGenerados = get_data_element(selectedSector, selectedElements);
});

datosGenerados = get_data_element(selectedSector, selectedElements);

function get_data_element(sectorActive, elementsActive) {
  delete_markers();
  if (elementsActive === "1") {
    var startSubsectores = 0;
    var endSubsectores = arrayFiles.length;
  } else {
    var startSubsectores = elementsActive - 2;
    var endSubsectores = elementsActive - 1;
  }

  var startSector = sectorActive - 1;
  var endSector = sectorActive;

  var numSectores = 6;
  var sectores = [];

  for (var i = 0; i < numSectores; i++) {
    var sector = {
      sector: "Sector " + (i + 1),
      subsectores: [],
    };
    sectores.push(sector);
  }
  for (var a = startSubsectores; a < endSubsectores; a++) {
    (function (a) {
      fetch(arrayFiles[a].rute)
        .then((response) => response.json())
        .then(function (data) {
          elementsArray = Array.from(data);
          for (b = startSector; b <= endSector; b++) {
            var filteredElementsArray = elementsArray.filter(function (
              element
            ) {
              return parseInt(element.ideSector) === b;
            });
            filteredElementsArray.map(function (element) {
              element.ideSensor =
                "Sec" +
                b +
                "_" +
                arrayFiles[a].acronym +
                "_" +
                element.ideSensor;
              paint_markers(
                parseFloat(element.coorX),
                parseFloat(element.coorY),
                element.ideSensor,
                arrayFiles[a].icon
              );
              return element;
            });
            for (var c = 0; c < filteredElementsArray.length; c++) {
              sectores[b - 1].subsectores.push(filteredElementsArray[c]);
            }
          }
          createList(sectores[startSector]);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    })(a);
  }
  return sectores;
}

function delete_markers() {
  if (!makersElementsArray || !makersElementsArray.length) {
    console.log("No hay markers para eliminar");
  } else {
    for (var i = 0; i < makersElementsArray.length; ++i) {
      makersElementsArray[i].setMap(null);
    }
  }
  makersElementsArray = [];
}

// Función para crear el listado de elementos
function createList(sector) {
  var subsectores = sector.subsectores;

  // Limpiar el listado anterior
  listContainer.innerHTML = "";

  // Crear un nuevo listado de elementos
  var ul = document.createElement("ul");

  for (var i = 0; i < subsectores.length; i++) {
    var subsector = subsectores[i];
    var li = document.createElement("li");
    var nombre = subsector.ideSensor;
    li.textContent = nombre;

    // Agregar evento de clic para seleccionar el subsector
    li.addEventListener("click", function () {
      if (!selectedSubsectores.includes(this.textContent)) {
        if (selectedSubsectores.length < 6) {
          selectedSubsectores.push(this.textContent);
          this.classList.add("selected");
          //this.style.cursor = 'url(ruta-a-imagen-simbolo-minus.png), auto'; // Cambiar el cursor al símbolo "-"
          updateSelectedList();
        } else {
          this.style.cursor = "not-allowed"; // Cambiar el cursor a "no permitido" cuando se alcanza el número máximo de selecciones
        }
      } else {
        var index = selectedSubsectores.indexOf(this.textContent);
        selectedSubsectores.splice(index, 1);
        this.classList.remove("selected");
        this.style.cursor = "pointer"; // Restaurar el cursor a la mano
        updateSelectedList();
      }
    });

    // Agregar eventos para cambiar el cursor
    li.addEventListener("mouseenter", function () {
      if (!selectedSubsectores.includes(this.textContent)) {
        //this.style.cursor = 'url(ruta-a-imagen-simbolo-plus.png), auto'; // Cambiar el cursor al símbolo "+"
      } else {
        //this.style.cursor = 'url(ruta-a-imagen-simbolo-minus.png), auto'; // Cambiar el cursor al símbolo "-"
      }
    });

    li.addEventListener("mouseleave", function () {
      if (!selectedSubsectores.includes(this.textContent)) {
        this.style.cursor = "pointer"; // Restaurar el cursor a la mano
      } else {
        //this.style.cursor = 'url(ruta-a-imagen-simbolo-minus.png), auto'; // Mantener el cursor como símbolo "-"
      }
    });

    ul.appendChild(li);
  }

  // Agregar el listado al contenedor
  listContainer.appendChild(ul);

  // Resaltar los subsectores seleccionados
  highlightSelectedSubsectores();

  // Actualizar la variable dataTabs
  updateDataTabs();

  // Actualizar la matriz de datos
  updateMatrizDatos();
}

// Función para actualizar la lista de subsectores seleccionados
function updateSelectedList() {
  matrizDatosAux = [];
  selectedListContainer.innerHTML = "";
  for (var i = 0; i < selectedSubsectores.length; i++) {
    var li = document.createElement("li");
    li.textContent = selectedSubsectores[i];
    selectedListContainer.appendChild(li);
  }
  // Actualizar la variable dataTabs
  updateDataTabs();
  // Actualizar la matriz de datos
  updateMatrizDatos();
}

// Función para resaltar los subsectores seleccionados
function highlightSelectedSubsectores() {
  var subsectorList = listContainer.querySelectorAll("li");
  for (var i = 0; i < subsectorList.length; i++) {
    var subsector = subsectorList[i];
    if (selectedSubsectores.includes(subsector.textContent)) {
      subsector.classList.add("selected");
      //subsector.style.cursor = 'url(ruta-a-imagen-simbolo-minus.png), auto'; // Cambiar el cursor al símbolo "-"
    }
  }
  // Actualizar la variable dataTabs
  updateDataTabs();
  // Actualizar la matriz de datos
  updateMatrizDatos();
}

//Fin Box 2
/*
//Inicio Box 3

paint_graph([]);
function paint_graph(data) {
  Highcharts.setOptions({
    chart: {
      backgroundColor: "var(--color-bg-darker)",
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

  // Crear un array para almacenar las series de datos
  // var data1 = [];
  var seriesData = [];
  console.log(data);

  // Iterar sobre los elementos del array "data"
  for (var i = 0; i < data.length; i++) {
    var subsector = data[i];

    // Crear un array de puntos de datos para el subsector actual
    var subsectorData = [];

    // Iterar sobre los elementos de "valores" del subsector actual
    for (var j = 0; j < subsector.data.length; j++) {
      var punto = subsector.data[j];
      // Obtener la fecha y el valor del punto de datos
      var fecha = punto.fecha;
      var valor = parseFloat(punto.valor);
      var position = punto.yAxis;
      // Transformar la fecha al formato "mm/dd/aaaa hh:mm"
      var fechaParts = fecha.split(" ");
      var fechaSinHora = fechaParts[0];
      var hora = fechaParts[1];
      var fechaTransformada =
        fechaSinHora.split("/").reverse().join("/") + " " + hora;
      // Crear un objeto de punto de datos y agregarlo al array "subsectorData"
      subsectorData.push([new Date(fechaTransformada).getTime(), valor]);
    }
    // Crear un objeto de serie de datos y agregarlo al array "seriesData"
    seriesData.push({
      name: subsector.name,
      data: subsectorData,
      yAxis: position,
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
      text: "Gráfica de valores",
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
  // Inicializa la gráfica en el contenedor con el ID "container-graph"
  Highcharts.chart("container-graph", chartOptions);
}
//Fin Box 3

//Inicio Box 4
var matrizDatos = [];
var arrayFechas = [];
var dataTabs = 2;
var htmlDataTabs = "";
var dataTabsLeft = 100 / dataTabs;
var dataTabsLeftAdd = 0;
var leftActiveOld;

function updateDataTabs() {
  dataTabs = selectedSubsectores.length;
  dataTabsLeft = 100 / dataTabs;
  dataTabsLeftAdd = 0;
}

async function updateMatrizDatos() {
  matrizDatosAux = [];
  if (selectedSubsectores.length >= 0) {
    console.log("selectedSubsectores.length:");
    console.log(selectedSubsectores.length);
    for (var i = 0; i < selectedSubsectores.length; i++) {
      var subsectorName = selectedSubsectores[i];
      var subsectorData = await getSubsectorData(subsectorName);
      check_subsector_existence(subsectorName, subsectorData);
      //matrizDatosAux.push({ name: subsectorName, data: subsectorData });
      console.log("matrizDatosAux1:");
      console.log(matrizDatosAux);
    }
    paint_tables(selectedSubsectores.length, matrizDatosAux);
    var lastTable = document.getElementById("lastTable");
    if (lastTable) {
      var leftActiveNew = $(lastTable).css("left");
      var leftActiveNewPx = parseFloat(leftActiveNew);
      var parentWidth = $(lastTable).parent().width();
      var leftActiveNewPercent = (leftActiveNewPx / parentWidth) * 100;
      leftActiveOld = leftActiveNewPercent + "%";
      console.log(leftActiveOld);

      lastTable.classList.add("active");
      lastTable.style.left = "0%";
      lastTable.style.width = "100%";
    }
  }
}

function check_subsector_existence(subsectorName, subsectorData) {
  var existeSubsector = matrizDatosAux.some(function (item) {
    return item.name === subsectorName;
  });

  // Agregar el nuevo elemento solo si no existe
  if (!existeSubsector) {
    matrizDatosAux.push({ name: subsectorName, data: subsectorData });
  }

  // Restablecer la variable existeSubsector
  existeSubsector = false; // O cualquier otro valor que desees asignar
}

function getSubsectorData(subsectorName) {
  let inicioAux = document.getElementById("inicio").value;
  let finAux = document.getElementById("fin").value;

  // Convertir las fechas de los inputs al formato 'aaaa-mm-ddThh:mm'
  let inicioParts = inicioAux.split(" ");
  let finParts = finAux.split(" ");

  let inicioDateParts = inicioParts[0].split("-");
  let finDateParts = finParts[0].split("-");

  let inicioDate = new Date(
    "20" +
      inicioDateParts[2] +
      "-" +
      inicioDateParts[1] +
      "-" +
      inicioDateParts[0] +
      "T" +
      inicioParts[1]
  );
  let finDate = new Date(
    "20" +
      finDateParts[2] +
      "-" +
      finDateParts[1] +
      "-" +
      finDateParts[0] +
      "T" +
      finParts[1]
  );
  console.log("inicioDate:");
  console.log(inicioDate);
  console.log("finDate:");
  console.log(finDate);

  var match = subsectorName.match(/_(.*?)_/);
  var typeElement = match ? match[1] : null;

  var partes = subsectorName.split("_");
  var nameElement = partes.slice(2).join("_");

  var matrizDatas = [];

  switch (typeElement) {
    case "cau":
      return fetch("public/json/dat_caudalimetros.json")
        .then((response) => response.json())
        .then(function (data) {
          flowmetersDatArray = Array.from(data);
          flowmeterDates = flowmetersDatArray.filter(function (flowmeter) {
            let flowmeterDate = new Date(flowmeter.instante);
            return (
              flowmeter.ideSensor === nameElement &&
              flowmeterDate >= inicioDate &&
              flowmeterDate <= finDate
            );
          });
          matrizDatas = flowmeterDates.map(function (flowmeter) {
            return {
              fecha: flowmeter.instante,
              valor: flowmeter.caudal,
              yAxis: 1,
            };
          });
          return matrizDatas;
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    case "niv":
      var match = subsectorName.match(/Sec(.*?)_/);
      var sectorElement = match ? match[1] : null;
      return fetch("public/json/dat_niveles.json")
        .then((response) => response.json())
        .then(function (data) {
          levelsDatArray = Array.from(data);
          levelDates = levelsDatArray.filter(function (level) {
            return level.ideSector === sectorElement;
          });
          matrizDatas = levelDates.map(function (level) {
            return {
              fecha: level.instante,
              valor: level.altura,
              yAxis: 0,
            };
          });
          return matrizDatas;
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    case "pre":
      var match = subsectorName.match(/Sec(.*?)_/);
      var sectorElement = match ? match[1] : null;
      return fetch("public/json/dat_presiones.json")
        .then((response) => response.json())
        .then(function (data) {
          pressuresDatArray = Array.from(data);
          let pressureDates = pressuresDatArray.filter(function (pressure) {
            return pressure.ideSector === sectorElement;
          });
          matrizDatas = pressureDates.map(function (pressure) {
            return {
              fecha: pressure.instante,
              valor: parseFloat((pressure.presion / 100).toFixed(2)),
              yAxis: 0,
            };
          });
          return matrizDatas;
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    case "val":
      var match = subsectorName.match(/Sec(.*?)_/);
      var sectorElement = match ? match[1] : null;
      return fetch("public/json/dat_valvulas.json")
        .then((response) => response.json())
        .then(function (data) {
          valvesDatArray = Array.from(data);
          valveDates = valvesDatArray.filter(function (valve) {
            return valve.ideSensor === nameElement;
          });
          matrizDatas = valveDates.map(function (valve) {
            return {
              fecha: valve.instante,
              valor: valve.estado,
              yAxis: 0,
            };
          });
          return matrizDatas;
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    default:
      return Promise.resolve([]); // Devuelve una promesa resuelta con un array vacío por defecto
  }
}

function paint_tables(dataTabs, matrizDatos) {
  var htmlDataTabs = "";
  var dataTabsLeft = 100 / dataTabs;
  var dataTabsLeftAdd = 0;
  for (i = 0; i < dataTabs; i++) {
    if (i === dataTabs - 1) {
      htmlDataTabs +=
        `
        <div class="slide" id="lastTable" style="left: ` +
        dataTabsLeftAdd +
        `%;">`;
    } else {
      htmlDataTabs +=
        `
        <div class="slide" style="left: ` +
        dataTabsLeftAdd +
        `%;">`;
    }
    htmlDataTabs +=
      `
          <a href="#">` +
      matrizDatos[i].name +
      `</a>
          <div class="content">
            <div class="table_container" id="table-container">
              <div class="table-container">  
                <table >
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody id="table` +
      i +
      `">
                    <!-- Aquí se generarán dinámicamente las filas de la tabla -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;
    dataTabsLeftAdd += dataTabsLeft;
  }
  $(".slides").html("");
  $(".slides").html(htmlDataTabs);
  $(".slides .slide").css("width", dataTabsLeft + "%");

  for (c = 0; c < dataTabs; c++) {
    var data = matrizDatos[c].data;
    // Imprimir el array de valores
    convertirDatos("Table_" + c, data);

    // Obtener referencia a la tabla
    var table = document.getElementById("table" + c);

    // Agregar registros a la tabla
    for (var i = 0; i < data.length; i++) {
      var registro = data[i];
      var row = table.insertRow();
      row.insertCell().innerText = registro.fecha;
      row.insertCell().innerText = registro.valor;
    }
  }

  $(".slide a").click(function () {
    var leftActiveNew = $(this).closest(".slide").css("left");
    var leftActiveNewPx = parseFloat(leftActiveNew); // Obtiene el valor numérico en píxeles
    var parentWidth = $(this).closest(".slide").parent().width(); // Obtiene el ancho del elemento padre
    var leftActiveNewPercent = (leftActiveNewPx / parentWidth) * 100; // Convierte el valor a porcentaje
    //var roundedPercent = Math.round(leftActiveNewPercent); // Redondea el valor a un número entero

    $(".slide.active").css("width", dataTabsLeft + "%");
    $(".slide.active").css("left", leftActiveOld);
    $(".slide.active").removeClass("active");
    $(this).closest(".slide").addClass("active");
    $(this).closest(".slide").css("left", "0%");
    $(this).closest(".slide").css("width", "100%");
    leftActiveOld = leftActiveNewPercent + "%";
    return false;
  });
  paint_graph(matrizDatosAux);
}

function convertirDatos(name, data) {
  var valores = [];
  arrayFechas = [];

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    arrayFechas.push(item.fecha);
    valores.push([
      Date.UTC(convertirFechas(item.fecha)),
      parseFloat(item.valor),
    ]);
  }
  matrizDatos.push({ name: name, data: valores });
  return matrizDatos;
}

function convertirFechas(fecha) {
  var partes = fecha.split(" ");
  var fechaPartes = partes[0].split("/");
  var horaPartes = partes[1].split(":");
  var dd = parseInt(fechaPartes[0], 10);
  var mm = parseInt(fechaPartes[1], 10) - 1;
  var yyyy = parseInt(fechaPartes[2], 10);
  var hh = parseInt(horaPartes[0], 10);
  var min = parseInt(horaPartes[1], 10);
  return yyyy, mm, dd, hh, min;
}*/

/****** IAGO ******/

// Box 1

const targetLongitude = -3.070035423095705;
const targetLatitude = 39.1430930560515;
let markers = [];

const googleMap = new google.maps.Map(document.getElementById("mapa"), {
  zoom: 11,
  streetViewControl: false,
  center: { lat: targetLatitude, lng: targetLongitude },
  mapTypeId: "satellite",
});

function paintMarker(tipo, coorX, coorY) {
  let marker = new google.maps.Marker({
    position: { lat: coorX, lng: coorY },
    map: googleMap,
    icon: {
      url: `/images/visor-datos/${tipo}.png`,
      scaledSize: new google.maps.Size(20, 30),
    },
  });
  markers.push(marker);
}

function cleanMap() {
  for (marker of markers) {
    marker.setMap(null);
  }
  markers = [];
}

// Box 2

function updateTime(element) {
  if (element.id === "fecha-inicio") {
    fechaFin.setAttribute("min", element.value);
  } else if (element.id === "fecha-fin") {
    fechaInicio.setAttribute("max", element.value);
  }
}

function updateElements() {
  cleanMap();
  let elements = Array.from(elementsList.querySelectorAll("li"));
  let displayElements = [...elements];
  console.log("valor -> ", sector.value);
  if (sector.value !== "0") {
    displayElements = displayElements.filter(
      (el) => el.dataset.sector === sector.value
    );
  }
  if (tipoElemento.value !== "todos") {
    displayElements = displayElements.filter(
      (el) => el.dataset.tipo === tipoElemento.value
    );
  }
  for (element of elements) {
    if (displayElements.includes(element)) {
      element.style.display = "list-item";
      paintMarker(
        element.dataset.tipo,
        +element.dataset.coorx,
        +element.dataset.coory
      );
    } else {
      element.style.display = "none";
    }
  }
}

function selectElement(element) {
  if (element.classList.contains("selected")) {
    element.classList.remove("selected");
    selectedElements.pop(element);
    if (selectedElements.length <= 6) {
      element.parentElement.classList.remove("blocked");
    }
  } else {
    if (selectedElements.length < 6) {
      element.classList.add("selected");
      selectedElements.push(element);
      if (selectedElements.length === 6) {
        element.parentElement.classList.add("blocked");
      }
    }
  }
}

updateElements();

// Box 3
async function loadData(params) {
  params.fechaInicio = dateToObject(fechaInicio.value).toISOString();
  params.fechaFin = dateToObject(fechaFin.value).toISOString();
  const response = await fetch(
    "/visor-datos/data?" + new URLSearchParams(params)
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

async function paintGraph() {
  let elements = Array.from(elementsList.querySelectorAll("li.selected"));
  let seriesData = [];
  for (element of elements) {
    let data = await loadData({
      idSensor: element.id,
      tipo: element.dataset.tipo,
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

  var chartOptions = {
    chart: {
      type: "line",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Gráfica de valores",
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

//Box 4
buildTable(
  ["Nombre", "Apellidos", "Teléfono", "Email", "Dirección"],
  registrosRegantes,
  "tablas",
  true
);
