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

const targetLongitude1 = -3.070035423095705;
const targetLatitude1 = 39.1430930560515;
let markers = [];

const googleMap = new google.maps.Map(document.getElementById("mapa_red"), {
  zoom: 11,
  streetViewControl: false,
  center: { lat: targetLatitude1, lng: targetLongitude1 },
  mapTypeId: "satellite",
});

function paintMarker(id, tipo, coorX, coorY) {
  let marker = new google.maps.Marker({
    position: { lat: coorX, lng: coorY },
    map: googleMap,
    icon: {
      url: `/images/estado-red/${tipo}.png`,
      scaledSize: new google.maps.Size(20, 30),
    },
  });

  // Crear una ventana de información (infowindow) con el ID
  let infowindow = new google.maps.InfoWindow({
    content: `ID: ${id}`
  });


  // Opcionalmente, puedes agregar un evento para abrir la infowindow cuando se haga clic en el marcador
  marker.addListener('click', function () {
    infowindow.open(googleMap, marker);
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
        element.dataset.id,
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
  //alert ("loadData " + params);
  params.fechaInicio = dateToObject(fechaInicio.value).toISOString();
  params.fechaFin = dateToObject(fechaFin.value).toISOString();

  alert(fechaInicio);
  const response = await fetch(
    "/estado-red/data?" + new URLSearchParams(params)
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
  let tablaData = [];
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

    if (seriesData.length === 0) {
      seriesData.push({
        name: 'No Data',
        data: [],
      });
    }

    Highcharts.chart('highchart-graph', {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Datos seleccionados'
      },
      subtitle: {
        text: seriesData.length === 1 && seriesData[0].data.length === 0 ? 'No hay datos en la fecha seleccionada' : ''
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Valores'
        }
      },
      series: seriesData,
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      }
    });

    // Obtén la referencia a la tabla
    // Obtén la referencia a la tabla y al cuerpo de la tabla
    const tabla = document.getElementById('tablaDatos');
    const tbody = tabla.querySelector('tbody');

    // Limpia el cuerpo de la tabla
    tbody.innerHTML = '';

    // Verifica si hay datos
    if (tablaData.length === 0) {
      // Si no hay datos, muestra un mensaje
      const mensajeFila = document.createElement('tr');
      const mensajeCelda = document.createElement('td');
      mensajeCelda.setAttribute('colspan', '3'); // Ocupar todas las columnas
      mensajeCelda.classList.add('no-data-message');
      mensajeCelda.textContent = 'No hay datos en la fecha seleccionada';
      mensajeFila.appendChild(mensajeCelda);
      tbody.appendChild(mensajeFila);
    } else {
      // Si hay datos, crea las filas de la tabla
      tablaData.forEach(function (dato) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
           <td>${dato.elemento}</td>
           <td>${dato.instante}</td>
           <td>${dato.valor}</td>
         `;
        tbody.appendChild(fila);
      });
    }

  }

  var chartOptions = {
    chart: {
      type: "line",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Datos seleccionados",
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
          text: "Valores (0-10)",
        },
        min: 0,
        max: 10,
      },
      {
        title: {
          text: "Valores (0-1000)",
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
    for (var i = 0; i < selectedSubsectores.length; i++) {
      var subsectorName = selectedSubsectores[i];
      var subsectorData = await getSubsectorData(subsectorName);
      check_subsector_existence(subsectorName, subsectorData);
      //matrizDatosAux.push({ name: subsectorName, data: subsectorData });
    }
    paint_tables(selectedSubsectores.length, matrizDatosAux);
    var lastTable = document.getElementById("lastTable");
    if (lastTable) {
      var leftActiveNew = $(lastTable).css("left");
      var leftActiveNewPx = parseFloat(leftActiveNew);
      var parentWidth = $(lastTable).parent().width();
      var leftActiveNewPercent = (leftActiveNewPx / parentWidth) * 100;
      leftActiveOld = leftActiveNewPercent + "%";
      if (selectedSubsectores.length < 2) {
        lastTable.classList.add("activeOnly");
        $(".table-container").css("height", "16.1vw");
      } else {
        lastTable.classList.add("active");
      }

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
                      <th>Elemento</th>
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
}


// Función para mostrar la pestaña seleccionada
function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  const tabLabels = document.querySelectorAll('.tab-label');
  tabLabels.forEach(label => label.classList.remove('active'));
  const activeLabel = document.querySelector(`.tab-label[data-tab="${tabId}"]`);
  activeLabel.classList.add('active');
}

/*Mapa de estado hidráulico */


var myMap;

var counterArray = [];
var markerPumpEstationsArray = [];
var makersCountersArray = [];
var makersCountersMasterArray = [];

var markerValveOpenArray = [];

var polygonsArray = [];
var polylinesArray = [];

var checkboxCounters = document.getElementById("item1-1");
var checkboxCountersWithoutWatering = document.getElementById("item1-1-1");
var checkboxCountersAnomalous = document.getElementById("item1-1-2");
var checkboxCountersWatering = document.getElementById("item1-1-3");
var checkboxCountersMaster = document.getElementById("item1-1-4");

var checkboxPumpEstation = document.getElementById("item1-2");

var checkboxValveOpen = document.getElementById("item2-1-1");
var checkboxValveClosed = document.getElementById("item2-1-2");

var checkboxFlechas = document.getElementById("item2-3-1");
checkboxFlechas.addEventListener("change", function () {
  delete_pipelines();
  paint_pipelines();
});

var infowindow = new google.maps.InfoWindow();
var infowindowTub = new google.maps.InfoWindow();
var infowindowsPlots = new Map(); // Objeto de mapa para almacenar los infowindows asociados a las parcelas
var infowindowspipelines = new Map(); // Objeto de mapa para almacenar los infowindows asociados a las tuberías

// Coordenadas
const targetLongitude = -3.070035423095705;
const targetLatitude = 39.1430930560515;
/*
const viewer = new Cesium.Viewer("cesiumContainer", {
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  creditContainer: document.createElement("div"), // Elemento HTML vacío para ocultar las letras
});

// Variable para verificar si los azulejos del globo se han cargado
let tilesLoaded = false;

// Verificar si los azulejos del globo ya han sido cargados
if (viewer.scene.globe.tilesLoaded) {
  // Los azulejos del globo ya han sido cargados
  tilesLoaded = true;
} else {
  // Esperar al evento 'tilesLoaded' para que los azulejos del globo se carguen por completo
  viewer.scene.globe.tileLoadProgressEvent.addEventListener(function () {
    // Los azulejos del globo se han cargado por completo
    tilesLoaded = true;
  });
}
*/
// Función para verificar periódicamente si los azulejos del globo se han cargado por completo
//function checkGlobeLoadingProgress() {
// if (tilesLoaded) {
// Los azulejos del globo se han cargado por completo, iniciar la animación de la cámara
// animateCamera();
// } else {
// Los azulejos del globo no se han cargado por completo, volver a verificar en 500 ms (ajusta este valor según sea necesario)
// setTimeout(checkGlobeLoadingProgress, 500);
//}
//}

// Iniciar la verificación periódica de carga de los azulejos del globo
//checkGlobeLoadingProgress();

/*function animateCamera() {
  // Zoom deseado
  const targetZoom = 14000;

  // Definir la posición de destino de la cámara
  const targetPosition = Cesium.Cartesian3.fromDegrees(
    targetLongitude,
    targetLatitude,
    targetZoom
  );
  const targetPositionCartographic =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(targetPosition);
  const targetHeight = targetPositionCartographic.height;

  // Animar la transición de la cámara
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromRadians(
      targetPositionCartographic.longitude,
      targetPositionCartographic.latitude,
      targetHeight
    ),
    orientation: {
      heading: viewer.camera.heading,
      pitch: viewer.camera.pitch,
      roll: viewer.camera.roll,
    },
    duration: 2, // Duración de la animación en segundos
    complete: function () {
      // La animación ha finalizado
      console.log("Animación completa");

      // Obtener referencia al segundo div
      var map = document.getElementById("mapContainer");

      // Mostrar el segundo div con un degradado
      map.style.opacity = 1;
    },
  });
}
*/
myMap = new google.maps.Map(document.getElementById("map"), {
  zoom: 12,
  streetViewControl: false,
  center: { lat: targetLatitude, lng: targetLongitude },
  zoomControl: true, // Deshabilita el control de zoom
  mapTypeId: "satellite",
  mapTypeControl: true, // Habilita el control de tipo de mapa
  mapTypeControlOptions: {
    //style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, // Estilo del control de tipo de mapa
    position: google.maps.ControlPosition.TOP_LEFT, // Posición del control de tipo de mapa
    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'], // Tipos de mapas disponibles
    // Ajustes adicionales si es necesario
  }
});


// Agregar un evento onclick al mapa
myMap.addListener('click', function (event) {
  // Obtener las coordenadas del lugar donde se hizo clic
  var clickedLocation = event.latLng;

  // Hacer algo con las coordenadas, como mostrarlas en un cuadro de diálogo
  //alert('Coordenadas: ' + clickedLocation.lat() + ', ' + clickedLocation.lng());

  document.getElementById("informacion").style.display = "none";
});
/*
// Evento para el botón de acercar
document.getElementById('zoomInBtn').addEventListener('click', function () {
  myMap.setZoom(myMap.getZoom() + 1);
});

// Evento para el botón de alejar
document.getElementById('zoomOutBtn').addEventListener('click', function () {
  myMap.setZoom(myMap.getZoom() - 1);
});

// Evento para el botón de alternar entre mapa normal y de satélite
document.getElementById('toggleSatelliteBtn').addEventListener('click', function () {
  var currentMapTypeId = myMap.getMapTypeId();
  if (currentMapTypeId === 'satellite') {
    myMap.setMapTypeId('roadmap');
  } else {
    myMap.setMapTypeId('satellite');
  }
});
*/

paint_counter_bbdd();

function paint_counter_bbdd() {
  contadores.forEach(contador => {
    console.log("Coordenada X:", contador.coorX);
    console.log("Coordenada Y:", contador.coorY);

    var iconUrl = "/images/mapa_sig/counter_without_watering.png";
    // Obtener las coordenadas
    var coorY = parseFloat(contador.coorY);
    var coorX = parseFloat(contador.coorX);
    var markerCounter = new google.maps.Marker({
      position: { lat: coorX, lng: coorY },
      map: myMap,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(30, 20),
      },
      title: contador.id,
    });
    // Agregar evento de clic al marker
    markerCounter.addListener("click", function (event) {

      var content = `
    <div class="infowindow-content">
        <div class="infowindow-header">
            <h2>Contador `+ contador.id + `</h2>
        </div>
        <div class="infowindow-body">
            <ul>
                <li><strong>Sector:</strong> S3</li>
                <li><strong>Tramo:</strong> Valor 2</li>
                <li><strong>Vol. Acum (m3):</strong> Valor 3</li>
                <li><strong>Vol. Rest (m3):</strong> Valor 1</li>
                <li><strong>Caudal (m3/h):</strong> Valor 2</li>
                <li><strong>Presión (mca):</strong> Valor 3</li>
                <li><strong>Parcela:</strong> Valor 1</li>
                <li class="infowindow-section-title">DATOS IRRINET</li>
                <li><strong>Vol. Global (m3):</strong> Valor 3</li>
                <li><strong>Caudal (m3/h):</strong> Valor 1</li>
                <li><strong>Vol. Parc (m3):</strong> Valor 2</li>
                <li><strong>Vol. Rest (m3):</strong> Valor 3</li>
                <li><strong>Válvula:</strong></li>
            </ul>
        </div>
    </div>
`;
      show_infowindow_plots(event, content);
      document.getElementById("informacion").style.display = "block";
      var content = "<div class='leyenda-container'>";
      content += "<span id='leyendaLabel'><b>Contador " + contador.id + "</b></span>";
      content += "<ul class='leyenda-list'>";
      content += "<li><span class='leyenda-item'>Sector:</span> S3</li>";
      content += "<li><span class='leyenda-item'>Tramo:</span> Valor 2</li>";
      content += "<li><span class='leyenda-item'>Vol. Acum (m3):</span> Valor 3</li>";
      content += "<li><span class='leyenda-item'>Vol. Rest (m3):</span> Valor 1</li>";
      content += "<li><span class='leyenda-item'>Caudal (m3/h):</span> Valor 2</li>";
      content += "<li><span class='leyenda-item'>Presión (mca):</span> Valor 3</li>";
      content += "<li><span class='leyenda-item'>Parcela:</span> Valor 1</li>";
      content += "<li class='leyenda-section-title'>DATOS IRRINET</li>";
      content += "<li><span class='leyenda-item'>Vol. Global (m3):</span> Valor 3</li>";
      content += "<li><span class='leyenda-item'>Caudal (m3/h):</span> Valor 1</li>";
      content += "<li><span class='leyenda-item'>Vol. Parc (m3):</span> Valor 2</li>";
      content += "<li><span class='leyenda-item'>Vol. Rest (m3):</span> Valor 3</li>";
      content += "<li><span class='leyenda-item'>Válvula:</span></li>";
      content += "</ul></div>";
      document.getElementById("informacion").innerHTML = content;
    });
    // Agregar el marker al arreglo
    makersCountersArray.push(markerCounter);
  });
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      switch (this.value) {
        case "item1-1":
          var checkboxCounter =
            document.getElementsByClassName("checkbox_counter");
          for (var i = 0; i < checkboxCounter.length; i++) {
            checkboxCounter[i].checked = true;
            checkboxCounter[i].disabled = false;
          }
          var checkboxCounterList = document.getElementsByClassName(
            "checkbox_counter_list"
          );
          if (checkboxCounterList.length > 0) {
            checkboxCounterList[0].style.opacity = 1;
          }
          paint_counter_bbdd();
          break;
        case "item1-1-1":
          paint_counter_bbdd();
          break;
        case "item1-1-2":
          paint_counter_bbdd();
          break;
        case "item1-1-3":
          paint_counter_bbdd();
          break;
        case "item1-1-4":
          paint_counter_bbdd();
          break;
        case "item1-2":
          paint_counter_bbdd();
          break;
        case "item2-1":
          paint_counter_bbdd();
          var checkboxValve = document.getElementsByClassName("checkbox_valve");
          for (var i = 0; i < checkboxValve.length; i++) {
            checkboxValve[i].checked = true;
            checkboxValve[i].disabled = false;
          }
          var checkboxValveList = document.getElementsByClassName(
            "checkbox_valve_list"
          );
          if (checkboxValveList.length > 0) {
            checkboxValveList[0].style.opacity = 1;
          }
          break;
        case "item2-1-1":
          paint_counter_bbdd();
          break;
        case "item2-1-2":
          paint_counter_bbdd();
          break;
        case "item2-2":
          paint_plots();
          var checkboxPressure =
            document.getElementsByClassName("checkbox_pressure");
          for (var i = 0; i < checkboxPressure.length; i++) {
            checkboxPressure[i].checked = true;
            checkboxPressure[i].disabled = false;
          }
          var checkboxPressureList = document.getElementsByClassName(
            "checkbox_pressure_list"
          );
          if (checkboxPressureList.length > 0) {
            checkboxPressureList[0].style.opacity = 1;
          }
          break;
        case "item2-3":
          paint_pipelines();
          // Habilitar el checkbox "item2.2"
          var checkboxPipelines =
            document.getElementsByClassName("checkbox_pipelines");
          for (var i = 0; i < checkboxPipelines.length; i++) {
            checkboxPipelines[i].checked = true;
            checkboxPipelines[i].disabled = false;
          }
          var checkboxPipelinesList = document.getElementsByClassName(
            "checkbox_pipelines_list"
          );
          if (checkboxPipelinesList.length > 0) {
            checkboxPipelinesList[0].style.opacity = 1;
          }
          break;
      }
    } else {
      switch (this.value) {
        case "item1-1":
          var checkboxCounter =
            document.getElementsByClassName("checkbox_counter");
          for (var i = 0; i < checkboxCounter.length; i++) {
            checkboxCounter[i].checked = false;
            checkboxCounter[i].disabled = true;
          }
          var checkboxCounterList = document.getElementsByClassName(
            "checkbox_counter_list"
          );
          if (checkboxCounterList.length > 0) {
            checkboxCounterList[0].style.opacity = 0.5;
          }
          delete_counter();
          break;
        case "item1-1-1":
          delete_counter();
          break;
        case "item1-1-4":
          delete_counter();
          break;
        case "item1-2":
          delete_counter();
          break;
        case "item2-1":
          var checkboxValve = document.getElementsByClassName("checkbox_valve");
          for (var i = 0; i < checkboxValve.length; i++) {
            checkboxValve[i].checked = false;
            checkboxValve[i].disabled = true;
          }
          var checkboxValveList = document.getElementsByClassName(
            "checkbox_valve_list"
          );
          if (checkboxValveList.length > 0) {
            checkboxValveList[0].style.opacity = 0.5;
          }
          delete_counter();
          break;
        case "item2-1-1":
          delete_counter();
          break;
        case "item2-1-2":
          delete_counter();
          break;
        case "item2-2":
          var checkboxPressure =
            document.getElementsByClassName("checkbox_pressure");
          for (var i = 0; i < checkboxPressure.length; i++) {
            checkboxPressure[i].checked = false;
            checkboxPressure[i].disabled = true;
          }
          var checkboxPressureList = document.getElementsByClassName(
            "checkbox_pressure_list"
          );
          if (checkboxPressureList.length > 0) {
            checkboxPressureList[0].style.opacity = 0.5;
          }
          delete_plots();
          break;
        case "item2-3":
          delete_pipelines();
          // Deshabilitar y desmarcar el checkbox "item2.2"
          var checkboxPipelines =
            document.getElementsByClassName("checkbox_pipelines");
          for (var i = 0; i < checkboxPipelines.length; i++) {
            checkboxPipelines[i].checked = false;
            checkboxPipelines[i].disabled = true;
          }
          var checkboxPipelinesList = document.getElementsByClassName(
            "checkbox_pipelines_list"
          );
          if (checkboxPipelinesList.length > 0) {
            checkboxPipelinesList[0].style.opacity = 0.5;
          }
          break;
      }
    }
  });
});

// Agrega un evento de cambio de zoom al mapa
google.maps.event.addListener(map, "zoom_changed", function () {
  // Obtiene el nivel de zoom actual
  var zoomLevel = map.getZoom();

  // Calcula el nuevo tamaño del icono del marcador en función del nivel de zoom
  var iconSize = 20 + zoomLevel * 2; // Ajusta el tamaño según tus preferencias

  // Establece el nuevo tamaño del icono del marcador
  marker.setIcon({
    url: "path/to/marker-icon.png", // Ruta del icono del marcador
    scaledSize: new google.maps.Size(iconSize, iconSize), // Tamaño actualizado del icono del marcador
  });
});

function paint_counter() {
  fetch("json/nodes.json")
    .then((response) => response.json())
    .then(function (data) {
      var countersArray = Array.from(data);
      countersArray.forEach(function (counter) {
        if (checkboxCountersWithoutWatering.checked) {
          if (counter.tipoEle == 2) {
            var iconUrl = "/images/mapa_sig/counter_without_watering.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerCounter = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 20),
              },
              title: counter.ideEle,
            });
            // Agregar evento de clic al marker
            markerCounter.addListener("click", function (event) {
              show_infowindow_plots(event, counter.ideEle);
            });
            // Agregar el marker al arreglo
            makersCountersArray.push(markerCounter);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
        if (checkboxCountersAnomalous.checked) {
        }
        if (checkboxCountersWatering.checked) {
        }
        if (checkboxCountersMaster.checked) {
          if (counter.tipoEle == 4) {
            var iconUrl = "/images/mapa_sig/counter_master.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerCounterMaster = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 20),
              },
              title: counter.ideEle,
            });
            // Agregar evento de clic al marker
            markerCounterMaster.addListener("click", function (event) {
              show_infowindow_plots(event, counter.ideEle);
            });
            // Agregar el marker al arreglo
            makersCountersMasterArray.push(markerCounterMaster);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
        if (checkboxPumpEstation.checked) {
          if (counter.tipoEle == 0) {
            var iconUrl = "/images/mapa_sig/pump_station.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerPumpEstation = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(20, 20),
              },
              title: counter.ideEle,
            });
            // Agregar evento de clic al marker
            markerPumpEstation.addListener("click", function (event) {
              show_infowindow_plots(event, counter.ideEle);
            });
            // Agregar el marker al arreglo
            markerPumpEstationsArray.push(markerPumpEstation);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
        if (checkboxValveOpen.checked) {
          if (counter.tipoEle == 3) {
            var iconUrl = "/images/mapa_sig/valve_open.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerValveOpen = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(20, 20),
              },
              title: counter.ideEle,
            });
            // Agregar evento de clic al marker
            markerValveOpen.addListener("click", function (event) {
              show_infowindow_plots(event, counter.ideEle);
            });
            // Agregar el marker al arreglo
            markerValveOpenArray.push(markerValveOpen);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function paint_counter_bbdd1() {

  fetch("/mapa-sig/getContadoresMapa")
    .then((response) => response.json())
    .then(function (data) {
      //console.log(data);
      var countersArray = Array.from(data);
      //console.log(countersArray);
      countersArray.forEach(function (counter) {
        if (checkboxCountersWithoutWatering.checked) {
          if (counter.tipoElemento == 2) {
            console.log(counter.id)
            var iconUrl = "/images/mapa_sig/counter_without_watering.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerCounter = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 20),
              },
              title: counter.id,
            });
            // Agregar evento de clic al marker
            markerCounter.addListener("click", function (event) {
              show_infowindow_plots(event, counter.id);
            });
            // Agregar el marker al arreglo
            makersCountersArray.push(markerCounter);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
        if (checkboxCountersAnomalous.checked) {
        }
        if (checkboxCountersWatering.checked) {
        }
        if (checkboxCountersMaster.checked) {
          if (counter.tipoElemento == 4) {
            var iconUrl = "/images/mapa_sig/counter_master.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerCounterMaster = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 20),
              },
              title: counter.id,
            });
            // Agregar evento de clic al marker
            markerCounterMaster.addListener("click", function (event) {
              show_infowindow_plots(event, counter.id);
            });
            // Agregar el marker al arreglo
            makersCountersMasterArray.push(markerCounterMaster);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
        if (checkboxPumpEstation.checked) {
          if (counter.tipoElemento == 0) {
            var iconUrl = "/images/mapa_sig/pump_station.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerPumpEstation = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(20, 20),
              },
              title: counter.id,
            });
            // Agregar evento de clic al marker
            markerPumpEstation.addListener("click", function (event) {
              show_infowindow_plots(event, counter.id);
            });
            // Agregar el marker al arreglo
            markerPumpEstationsArray.push(markerPumpEstation);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
        if (checkboxValveOpen.checked) {
          if (counter.tipoElemento == 3) {
            var iconUrl = "/images/mapa_sig/valve_open.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerValveOpen = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(20, 20),
              },
              title: counter.id,
            });
            // Agregar evento de clic al marker
            markerValveOpen.addListener("click", function (event) {
              show_infowindow_plots(event, counter.id);
            });
            // Agregar el marker al arreglo
            markerValveOpenArray.push(markerValveOpen);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });

}

// Función para eliminar los marcadores del array
function delete_counter() {
  if (!checkboxCountersWithoutWatering.checked) {
    for (var i = 0; i < makersCountersArray.length; i++) {
      makersCountersArray[i].setMap(null); // Eliminar el marcador del mapa
    }
    makersCountersArray = []; // Vaciar el array de marcadores
  }
  if (!checkboxCountersMaster.checked) {
    for (var i = 0; i < makersCountersMasterArray.length; i++) {
      makersCountersMasterArray[i].setMap(null); // Eliminar el marcador del mapa
    }
    makersCountersMasterArray = []; // Vaciar el array de marcadores
  }
  if (!checkboxPumpEstation.checked) {
    for (var i = 0; i < markerPumpEstationsArray.length; i++) {
      markerPumpEstationsArray[i].setMap(null); // Eliminar el marcador del mapa
    }
    markerPumpEstationsArray = []; // Vaciar el array de marcadores
  }
  if (!checkboxValveOpen.checked) {
    for (var i = 0; i < markerValveOpenArray.length; i++) {
      markerValveOpenArray[i].setMap(null); // Eliminar el marcador del mapa
    }
    markerValveOpenArray = []; // Vaciar el array de marcadores
  }
}

function paint_valve() {
  fetch("/json/mapa_sig.json")
    .then((response) => response.json())
    .then(function (data) {
      var countersArray = Array.from(data);
      countersArray.forEach(function (counter) {
        if (checkboxCountersWithoutWatering.checked) {
          if (counter.tipoEle == 3) {
            if (checkboxValvesOpen.checked) {
              var iconUrl = "/images/mapa_sig/counter_without_watering.png";
            }
            if (checkboxValvesclosed.checked) {
              var iconUrl = "/images/mapa_sig/counter_without_watering.png";
            }

            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerCounter = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 20),
              },
              title: counter.ideEle,
            });
            // Agregar evento de clic al marker
            markerCounter.addListener("click", function (event) {
              show_infowindow_plots(event, counter.ideEle);
            });
            // Agregar el marker al arreglo
            makersCountersArray.push(markerCounter);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }

        if (checkboxCountersMaster.checked) {
          if (counter.tipoEle == 4) {
            var iconUrl = "/images/mapa_sig/counter_master.png";
            // Obtener las coordenadas
            var coorY = parseFloat(counter.coorY);
            var coorX = parseFloat(counter.coorX);
            var markerCounterMaster = new google.maps.Marker({
              position: { lat: coorX, lng: coorY },
              map: myMap,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 20),
              },
              title: counter.ideEle,
            });
            // Agregar evento de clic al marker
            markerCounterMaster.addListener("click", function (event) {
              show_infowindow_plots(event, counter.ideEle);
            });
            // Agregar el marker al arreglo
            makersCountersMasterArray.push(markerCounterMaster);
            // Guardar el infowindow asociado al polígono de parcela
            //infowindowscounters.set(markerCounter, infowindow);
          }
        }
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function paint_plots() {
  var plotCoords = [];
  fetch("json/parcelas.json")
    .then((response) => response.json())
    .then(function (data) {
      var plotsArray = Array.from(data);
      plotsArray.forEach(function (plot) {
        if (plot.nSecuencial == 1) {
          if (plotCoords.length > 0) {
            // Declaración y asignación de la variable pressureValor
            var pressureValor = 16;
            // Llamada a la función adjust_pressure_color pasando pressureValor como argumento
            var pressureColor = adjust_pressure_color(pressureValor);
            // Crear el área poligonal para la parcela
            var polygon = new google.maps.Polygon({
              paths: plotCoords,
              strokeColor: "#FCAE1E", // Color del borde del área
              strokeOpacity: 0.8, // Opacidad del borde del área
              strokeWeight: 1, // Grosor del borde del área
              fillColor: pressureColor, // Color de relleno del área
              fillOpacity: 0.35, // Opacidad del relleno del área
            });
            // Agregar evento de clic al polígono
            polygon.addListener("click", function (event) {
              show_infowindow_plots(event, plot.ideParcela);
            });

            // Agregar el área poligonal al mapa
            polygon.setMap(myMap);
            // Agregar el polígono al arreglo
            polygonsArray.push(polygon);
            // Guardar el infowindow asociado al polígono de parcela
            infowindowsPlots.set(polygon, infowindow);
          }
          plotCoords = []; // Array para almacenar las coordenadas de los puntos de la parcela
        }
        // Obtener las coordenadas de los puntos de la parcela y agregarlas al array plotCoords
        plotCoords.push({
          lat: parseFloat(plot.coorX),
          lng: parseFloat(plot.coorY),
        });
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function adjust_pressure_color(pressureValor) {
  switch (true) {
    case pressureValor < 15:
      return "grey"; // Color en hexadecimal para valores menores a 15
    case pressureValor >= 15 && pressureValor < 20:
      return "green"; // Color en hexadecimal para valores entre 15 y 20
    case pressureValor >= 20 && pressureValor < 25:
      return "blue"; // Color en hexadecimal para valores entre 20 y 25
    case pressureValor >= 25 && pressureValor < 30:
      return "orange"; // Color en hexadecimal para valores entre 25 y 30
    default:
      return "purple"; // Color en hexadecimal para valores mayores o iguales a 30
  }
}

function show_infowindow_plots(event, content) {
  infowindow.setContent(content);
  infowindow.setPosition(event.latLng);
  infowindow.open(myMap);
}

function delete_plots() {
  // Eliminar los polígonos de parcelas del mapa y sus correspondientes infowindows
  polygonsArray.forEach(function (polygon) {
    if (polygon instanceof google.maps.Polygon) {
      polygon.setMap(null);
      // Obtener el infowindow asociado al polígono de parcela y cerrarlo
      var infowindowClosed = infowindowsPlots.get(polygon);
      if (infowindowClosed) {
        infowindowClosed.close();
        infowindowsPlots.delete(polygon); // Eliminar el infowindow del mapa
      }
    }
  });

  // Filtrar los polígonos que no son de parcelas y conservar solo las tuberías
  polygonsArray = polygonsArray.filter(function (polygon) {
    return polygon instanceof google.maps.Polyline;
  });
}

function paint_pipelines() {
  var pipelineCoords = [];
  fetch("json/tuberias.json")
    .then((response) => response.json())
    .then(function (data) {
      var pipelineArray = Array.from(data);
      pipelineArray.forEach(function (pipeline) {
        if (pipeline.numCurva == 1) {
          if (pipelineCoords.length > 0) {
            // Crear la línea para la tubería
            var polyline = new google.maps.Polyline({
              path: pipelineCoords,
              strokeColor: "#000", // Color de la línea
              strokeOpacity: 1, // Opacidad de la línea
              strokeWeight: 2, // Grosor de la línea
            });
            // Agregar evento de clic al polígono
            polyline.addListener("click", function (event) {
              mostrar_infowindow_tuberias(event, pipeline.ideEle);
            });
            // Agregar la línea al mapa
            polyline.setMap(myMap);
            // Agregar la línea al arreglo
            polylinesArray.push(polyline);
            // Guardar el infowindow asociado a la polilínea de tubería
            infowindowspipelines.set(polyline, infowindow);
            // Verificar el estado del checkbox
            var checkboxarrowhead = document.getElementById("item2-3-1");
            if (checkboxarrowhead.checked) {
              // Agregar la punta de flecha a la polilínea
              add_arrowhead(polyline);
            }
          }
          pipelineCoords = []; // Array para almacenar las coordenadas de los puntos de la parcela
        }
        // Obtener las coordenadas de los puntos de la parcela y agregarlas al array parcelaCoords
        pipelineCoords.push({
          lat: parseFloat(pipeline.coorX),
          lng: parseFloat(pipeline.coorY),
        });
      });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function mostrar_infowindow_tuberias(event, content) {
  infowindow.setContent(content);
  infowindow.setPosition(event.latLng);
  infowindow.open(myMap);
}

function delete_pipelines() {
  // Eliminar las polilíneas de tuberías del mapa y sus correspondientes infowindows
  polylinesArray.forEach(function (polyline) {
    if (polyline instanceof google.maps.Polyline) {
      polyline.setMap(null);
      // Obtener el infowindow asociado a la polilínea de tubería y cerrarlo
      var infowindowClosed = infowindowspipelines.get(polyline);
      if (infowindowClosed) {
        infowindowClosed.close();
        infowindowspipelines.delete(polyline); // Eliminar el infowindow del mapa
      }
    }
  });

  // Filtrar las polilíneas que no son de tuberías y conservar solo las parcelas
  polylinesArray = polylinesArray.filter(function (polyline) {
    return polyline instanceof google.maps.Polyline;
  });
}

function add_arrowhead(polyline) {
  // Crear el símbolo de la punta de flecha
  var symbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // Utilizar la flecha cerrada hacia adelante como símbolo
    scale: 2, // Escala del símbolo
    strokeColor: "#FF0000", // Color de la línea del símbolo
  };

  // Agregar el símbolo a la polilínea
  polyline.setOptions({
    icons: [
      {
        icon: symbol,
        offset: "50%", // Colocar el símbolo en el extremo final de la polilínea
      },
    ],
  });
}

function toggleLeyenda() {
  var leyenda = document.getElementById('leyenda'); // Asegúrate de que este es el ID de tu capa de leyenda
  var button = document.getElementById('toggle-button');
  var icon = document.getElementById('leyenda-icon');

  if (leyenda.style.display === 'none' || leyenda.style.display === '') {
    icon.classList.add('fa-eye-slash');
    icon.classList.remove('fa-eye');
    button.querySelector('span').textContent = 'Leyenda';
    leyenda.style.display = 'block'; // Muestra la capa leyenda
  } else {
    icon.classList.add('fa-eye');
    icon.classList.remove('fa-eye-slash');
    button.querySelector('span').textContent = 'Leyenda';
    leyenda.style.display = 'none'; // Oculta la capa leyenda
  }
}


function exportTableToExcel(tableID, filename = '') {
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

  // Specify file name
  filename = filename ? filename + '.xls' : 'excel_data.xls';

  // Create download link element
  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob(['ufeff', tableHTML], {
      type: dataType
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

    // Setting the file name
    downloadLink.download = filename;

    //triggering the function
    downloadLink.click();
  }
}

function exportDataToExcel(data, filename = '') {
  const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet 1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
  const footer = '</body></html>';
  let table = '<table>';

  // Add table headers
  const headers = Object.keys(data[0]);
  table += '<tr>';
  headers.forEach(header => {
    table += `<th>${header}</th>`;
  });
  table += '</tr>';

  // Add table rows
  data.forEach(row => {
    table += '<tr>';
    headers.forEach(header => {
      table += `<td>${row[header]}</td>`;
    });
    table += '</tr>';
  });

  table += '</table>';
  const blob = new Blob([header + table + footer], {
    type: 'application/vnd.ms-excel'
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//Cómo realizo una animación donde al carga la página se vea el globo terráqueo y haga un zoom progresivo hasta situarse en las coordenadas lat: 39.144025, lng: -3.094583 sobre mi mapade google, para el inicio de la animación otra biblioteca distintaa la de google?
// function hide_arrowhead {

// }

var seriesData = [];
seriesData.push({
  name: 'No Data',
  data: [],
});


Highcharts.chart('highchart-graph', {
  chart: {
    type: 'line'
  },
  title: {
    text: 'Datos seleccionados'
  },
  subtitle: {
    text: seriesData.length === 1 && seriesData[0].data.length === 0 ? 'No hay datos' : ''
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    type: 'datetime'
  },
  yAxis: {
    title: {
      text: 'Valores'
    }
  },
  series: seriesData,
  noData: {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#303030'
    }
  }
});