

var myMap;

var counterArray = [];
var markerPumpEstationsArray = [];
var makersCountersArray = [];
var makersCountersMasterArray = [];

var markerValveOpenArray = [];

var polygonsArray = [];
var polygonsCultivosArray = [];
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
    position: google.maps.ControlPosition.TOP_RIGHT, // Posición del control de tipo de mapa
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
  infowindow.close();
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
      document.getElementById("informacion").style.display = "none";
      var content = `
    <div class="infowindow-content">
        <div class="infowindow-header">
            <h2>Contador `+ contador.id + `</h2>
        </div>
        <div class="infowindow-body">
            <ul>
                <li><strong>Sector:</strong> `+ contador.sector + `</li>
                <li><strong>Tramo:</strong> `+ contador.tramo + `</li>
                <li><strong>Ramal:</strong> `+ contador.ramal + `</li>
                <li><strong>Titular:</strong> `+ contador.titular + `</li>
                <li><strong>Vol. Acum (m3):</strong> `+ contador.acumulado + `</li>
                <li><strong>Instante:</strong> `+ contador.instante + `</li>
                <li><strong>Bateria:</strong> `+ contador.bateria + `</li>
                <li><strong>Radio:</strong> `+ contador.radio + `</li>
                <li><strong>Marca:</strong> `+ contador.marca + `</li>
                <li><strong>Dimensión:</strong> `+ contador.dimension + `</li>
                <li><strong>Vol. Global (m3):</strong> `+ contador.volAsignado + `</li
            </ul>
        </div>
    </div>
`;
      show_infowindow_plots(event, content);
      document.getElementById("informacion").style.display = "block";
      var content = "<div class='leyenda-container'>";
      content += "<span id='leyendaLabel'><b>Contador " + contador.id + "</b></span>";
      content += "<div>"
      content += "<ul class='leyenda-list'>";
      content += "<li><span class='leyenda-item'>Sector:</span>" + contador.sector + "</li>";
      content += "<li><span class='leyenda-item'>Tramo:</span> " + contador.tramo + "</li>";
      content += "</ul></div>";
      content += "<div>"
      content += "<div id='highchart-graph'></div>";
      content += "</div></div>";
      document.getElementById("informacion").innerHTML = content;
      paintGraph();
    });
    // Agregar el marker al arreglo
    makersCountersArray.push(markerCounter);
  });
}
async function paintGraph() {
  //let elements = Array.from(document.getElementById("contadores").querySelectorAll("option:checked"));
  let seriesData = [];


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
      text: "Histórico",
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

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const leyenda2 = document.getElementById('leyenda2');

function updateLeyenda() {
  // Asegúrate de que leyenda2 es el id correcto
  leyenda2.innerHTML = ''; // Limpiar la capa leyenda2

  // Función auxiliar para crear y añadir un item a la leyenda
  function addLegendItem(content, category) {
    const legendItem = document.createElement('div');
    legendItem.classList.add('legend2_item');
    legendItem.innerHTML = `<label class='checkbox_label_leyenda2'>${content}</label>`;
    category.appendChild(legendItem);
  }

  // Crear contenedores para cada categoría
  const categories = {};

  // Iterar sobre los checkboxes y agregar los elementos seleccionados a la leyenda
  checkboxes.forEach(function (checkbox) {
    if (checkbox.checked) {
      const label = document.querySelector(`label[for="${checkbox.id}"]`);
      if (label) {
        const categoryName = label.textContent.trim(); // Usar el texto del label como nombre de la categoría
        if (!categories[categoryName]) {
          const categoryDiv = document.createElement('div');
          categoryDiv.classList.add('legend_category');
          categoryDiv.innerHTML = `<h4>${categoryName}</h4>`;
          leyenda2.appendChild(categoryDiv);
          categories[categoryName] = categoryDiv;
        }
        
        // Agregar el propio checkbox a la leyenda
        addLegendItem(label.innerHTML, categories[categoryName]);
        
        // Agregar los sub-checkboxes si los hay
        const subCheckboxes = document.querySelectorAll(`input[type="checkbox"][id^="${checkbox.id}-"]`);
        subCheckboxes.forEach(function (subCheckbox) {
          if (subCheckbox.checked) {
            const subLabel = document.querySelector(`label[for="${subCheckbox.id}"]`);
            if (subLabel) {
              addLegendItem(subLabel.innerHTML, categories[categoryName]);
            }
          }
        });
        
        // Agregar los legend-items para cultivos
        if (checkbox.id === 'item2-2' && checkbox.checked) { // Suponiendo que el id del checkbox de cultivos es 'item2-2'
          const legendItems = document.querySelectorAll('.legend-item');
          legendItems.forEach(function (legendItem) {
            addLegendItem(legendItem.outerHTML, categories[categoryName]);
          });
        }
      }
    }
  });
}


checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function () {
    updateLeyenda();

    if (this.checked) {

      switch (this.value) {
        case "item1-1": //Contadores
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
        case "item1-2": //Estaciones de bombeo
          paint_counter();
          break;
        case "item2-1":
          paint_counter();
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
        case "item2-2":
          // Seleccionar todos los cultivos
          $('.legend-item').each(function () {
            $(this).addClass('selected');
            var cultivo = $(this).data('value');
            if (!selectedCultivos.includes(cultivo)) {
              selectedCultivos.push(cultivo);
            }
          });
          paint_cultivos();
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
        case "item2-2":
          // Deseleccionar todos los cultivos
          $('.legend-item').each(function () {
            $(this).removeClass('selected');
          });
          selectedCultivos = [];
          delete_cultivos();
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
  fetch("/json/node.json")
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
function getCultivoColor(cultivo) {
  switch (cultivo) {
    case "Ajos":
      return "#ff5733";
    case "Árboles":
      return "#ffc300";
    case "Melón":
      return "#32a852";
    case "Guisantes":
      return "#e0a218";
    case "Huerta":
      return "#9f39b5";
    case "Alfalfa":
      return "#1f96e9";
    case "Sandía":
      return "#ffd700";
    case "Veza":
      return "#adff2f";
    case "Olivo":
      return "#dda0dd";
    case "Tomate":
      return "#800080";
    case "Vallardo":
      return "#4b0082";
    case "Espárrago":
      return "#c0c0c0";
    case "Trigo":
      return "#2e8b57";
    case "Maíz":
      return "#20b2aa";
    case "Chalet":
      return "#ff1493";
    default:
      return "#00ff7f"; // Por defecto, No definido
  }
}
$(document).ready(function () {
  $('.legend-item2').click(function () {
    $(this).toggleClass('selected');
  });
});

var selectedCultivos = [];

$(document).ready(function () {
  $('.legend-item').click(function () {
    $(this).toggleClass('selected');
    var cultivo = $(this).data('value');
    if ($(this).hasClass('selected')) {
      if (!selectedCultivos.includes(cultivo)) {
        selectedCultivos.push(cultivo);
      }
    } else {
      selectedCultivos = selectedCultivos.filter(function (item) {
        return item !== cultivo;
      });
    }
    paint_cultivos(); // Llamar a la función de pintura cada vez que se selecciona/deselecciona un cultivo
  });

  // Inicializar la función de pintura al cargar la página
  paint_cultivos();
});

function paint_cultivos() {
  var plotCoords = [];
  fetch("json/cultivos.json")
    .then((response) => response.json())
    .then(function (data) {
      // Limpiar los polígonos existentes antes de pintar nuevos
      polygonsCultivosArray.forEach(function (polygon) {
        polygon.setMap(null);
      });
      polygonsCultivosArray = [];

      var plotsArray = Array.from(data);
      plotsArray.forEach(function (plot) {
        if (selectedCultivos.includes(plot.cultivo)) { // Filtrar por cultivos seleccionados
          if (plot.nSecuencial == 1) {
            if (plotCoords.length > 0) {
              var cultivoColor = getCultivoColor(plot.cultivo);
              var polygon = new google.maps.Polygon({
                paths: plotCoords,
                strokeColor: "#FCAE1E",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: cultivoColor,
                fillOpacity: 0.35,
              });
              polygon.addListener("click", function (event) {
                document.getElementById("informacion").style.display = "none";
                var content = '<div class="campo-container">' +
                  '<div class="campo-header">' +
                  '<h3 style="color: #009bdb; font-weight:bold">Parcela ' + plot.ideParcela + '</h3>' +
                  '</div>' +
                  '<div class="campo-tab-content active" id="datos">' +
                  '   <div class="campo-content">' +
                  '       <div class="column">' +
                  '           <p id="hectareasInfo">Hectáreas: N/A</p>' +
                  '          <p id="cultivoInfo">Cultivo: N/A</p>' +
                  '      </div>' +
                  '      <div class="column">' +
                  '          <p>Explotación (PAC): Finca 2</p>' +
                  '          <p>Recintos SIGPAC: 46196:0:0:31:108:3</p>' +
                  '     </div>' +
                  '  </div>' +
                  '</div>' +
                  '                          <div class="campo-tab-content" id="cultivo">Contenido de Cultivo</div>' +
                  '<div class="campo-tab-content" id="actividades">Contenido de Actividades</div>' +
                  '<div class="campo-buttons">' +
                  '   <button class="campo-tab-button" data-tab="datos" onclick="showSubTab("datos")"><i class="fas fa-info-circle"></i> Datos' +
                  '       del campo</button>' +
                  '    <button class="campo-tab-button" data-tab="cultivo"' +
                  '        onclick="showSubTab("cultivo)"><i class="fas fa-seedling"></i> Cultivo</button>' +
                  '    <button class="campo-tab-button" data-tab="actividades"' +
                  '        onclick="showSubTab(actividades)"><i class="fas fa-tasks"></i> Histórico</button>' +
                  ' </div>' +
                  ' </div>';
                show_infowindow_plots(event, content);
              });
              polygon.setMap(myMap);
              polygonsCultivosArray.push(polygon);
              infowindowsPlots.set(polygon, infowindow);
            }
            plotCoords = [];
          }
          plotCoords.push({
            lat: parseFloat(plot.coorX),
            lng: parseFloat(plot.coorY),
          });
        }
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


function delete_cultivos() {
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
              document.getElementById("informacion").style.display = "none";
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

function toggleCapas() {
  var capas = document.getElementById('capas'); // Asegúrate de que este es el ID de tu capa de capas
  var button = document.getElementById('toggle-capas-button');
  var icon = document.getElementById('capas-icon');

  if (capas.style.display === 'none' || capas.style.display === '') {
    icon.classList.add('fa-layer-group');
    icon.classList.remove('fa-layer-minus');
    button.querySelector('span').textContent = 'Capas';
    capas.style.display = 'block'; // Muestra la capa capas
  } else {
    icon.classList.add('fa-layer-minus');
    icon.classList.remove('fa-layer-group');
    button.querySelector('span').textContent = 'Capas';
    capas.style.display = 'none'; // Oculta la capa capas
  }
}

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}


// Default open tab
document.addEventListener("DOMContentLoaded", function () {
  /*const availableInformationLabel = document.createElement('div');
  availableInformationLabel.className = 'available_information_label';
  const HTMLAvailableInformationLabelContent = `
      <div class='HTML_available_information_content_container'>
          <div class='HTML_available_information_content_container_type'>
              <label class='HTML_available_information_content_label_type'>
                  Información Disponible:
              </label>
              <span id='HTML-available-information-content-span-type' class='HTML_available_information_content_span_type'>    
              </span>
          </div>
      </div>
  `;
  availableInformationLabel.innerHTML = HTMLAvailableInformationLabelContent;
  myMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(availableInformationLabel);*/
  // Create the sidebar element
  var sidebar = document.getElementById('sidebar');

  // Create the tab-content element
  var tabContent = document.getElementById('tab-content');

  // Add the sidebar to the map
  myMap.controls[google.maps.ControlPosition.LEFT_TOP].push(sidebar);

  // Add the tab-content to the map
  myMap.controls[google.maps.ControlPosition.LEFT_TOP].push(tabContent);


  document.getElementsByClassName('tablink')[0].click();
  updateLeyenda();

  // Script para el acordeón
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const icon = header.querySelector('.fa-angle-down');

      if (content.style.display === 'block') {
        content.style.display = 'none';
      } else {
        document.querySelectorAll('.accordion-content').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.accordion-header .fa-angle-down').forEach(i => i.style.transform = 'rotate(0deg)');
        content.style.display = 'block';
      }
    });
  });
});


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





