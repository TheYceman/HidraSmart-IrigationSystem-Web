

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

//var checkboxFlechas = document.getElementById("item2-3-1");
//checkboxFlechas.addEventListener("change", function () {
//  delete_pipelines();
//  paint_pipelines();
//});

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
    mapTypeId: "roadmap",
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

//paint_counter_bbdd();

paint_stations();


function paint_stations() {
    var cont = 0;
    contadores.forEach(contador => {
        if (cont < 60) {
            console.log("Coordenada X:", contador.coorX);
            console.log("Coordenada Y:", contador.coorY);

            var iconUrl = "/images/mapa_sig/weather-station-facility-icon.jpg";
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
          <div style="width: 100%;background-color: #3c8dbc;color: #ffffff; padding-left: 4px; padding-right: 4px"><b>Finca El Serranillo</b></div><div class="row mt-2 ml-2 mb-1"><div class="col-12 mt-0 pt-0 mr-0 pr-0"><b>Datos diarios</b></div><div class="col-8 mt-0 pt-0 mr-0 pr-0"><input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control form-control-sm text-center" style="max-width: 160px" value="2024-05-07"><input type="date" id="fecha_fin" name="fecha_fin" class="form-control form-control-sm text-center" style="max-width: 160px" value="2024-05-16"></div><div class="col-4 mt-0 pt-2 ml-0 pl-2 pr-3"><button id="datos_diarios_btn" type="button" class="btn btn-primary bg-lightblue btn-sm text-lg btn-block" data-toggle="tooltip" data-placement="top" title="" onclick="consultaDatosDiarios()" data-original-title="Realizar consulta"><i class="fas fa-search" style="color: #fff"></i></button></div><div class="col-12 mt-3 pt-0 mr-0 pr-0"><b>Datos históricos</b></div><div class="col-3 mt-0 pt-1 mr-0 pr-1 text-right"><label>Año</label></div><div class="col-8 mt-0 pt-0 mr-0 pr-2"><input id="anio_historico" type="number" class="form-control form-control-sm text-center" min="1999" step="1" max="2024" value="2023"></div></div><div class="row ml-1 mb-2 mr-1"><div class="col-3"><button type="button" class="btn btn-primary bg-lightblue btn-sm text-md" data-toggle="tooltip" data-placement="top" title="" onclick="consultaDatosHistoricos(1)" data-original-title="Precipitación, ETo"><i class="fas fa-cloud-showers-heavy" style="color: #fff"></i></button></div><div class="col-3"><button type="button" class="btn btn-primary bg-lightblue btn-sm text-md" data-toggle="tooltip" data-placement="top" title="" onclick="consultaDatosHistoricos(2)" data-original-title="Termometría">&nbsp;<i class="fas fa-thermometer-three-quarters" style="color: #fff"></i>&nbsp;</button></div><div class="col-3"><button type="button" class="btn btn-primary bg-lightblue btn-sm text-md" data-toggle="tooltip" data-placement="top" title="" onclick="consultaDatosHistoricos(3)" data-original-title="Higrometría"><i class="fas fa-water" style="color: #fff"></i></button></div><div class="col-3"><button type="button" class="btn btn-primary bg-lightblue btn-sm text-md" data-toggle="tooltip" data-placement="top" title="" onclick="consultaDatosHistoricos(4)" data-original-title="Viento"><i class="fas fa-wind" style="color: #fff"></i></button></div></div>
      </div>
  `;
                show_infowindow_plots(event, content);
                document.getElementById("informacion").style.display = "block";
                var content = "<div class='leyenda-container'>";
                content += "<div class='ol-viewport' style='position: relative; overflow: hidden; width: 100%; height: 100%;'>";
                content += "<div class='ol-unselectable ol-layers' style='position: absolute; width: 100%; height: 100%; z-index: 0;'>";
                content += "<div class='ol-popup-content'><div style='width: 100%;background-color: #3c8dbc;color: #ffffff; padding-left: 4px; padding-right: 4px'><b>Prados Redondos</b></div><div class='flex ml-2 mr-2 mt-1'>    <div class='flex-auto text-xs'>  ";
                content += "<b>Instalación:</b> 20/12/2000 </div><div class='flex-auto text-xs'>        <b>Altitud:</b> 1109 m    </div></div><div class='flex ml-2 mr-2'>    <div class='flex-auto text-xs'>        <b>Datos:</b> 22/12/2000 - 19/05/2024    </div></div><div class='flex ml-2 mr-2'>    <div class='flex-auto text-xs'>        <b>Estado:</b> Activa";
                content += " </div>  content += '   <div class='flex-auto text-xs'>        <b>Información:</b> Actualizada    </div></div><div class='row ml-0 mr-2 mb-2 mt-1'>    <div class='col-2 text-center'>    </div>    <div class='col-2 text-center'><span class='text-xs font-bold'>Ayer</span>    </div>    ";
                content += "<div class='col-3 text-center'><span class='text-xs font-bold'>7 días</span>    </div>    <div class='col-3 text-center'><span class='text-xs font-bold'>Año</span>    </div>    <div class='col-2 text-center'>  ";
                content += "  </div>    <div class='col-2 text-center'><i class='fas fa-cloud-showers-heavy'></i>    </div>    ";
                content += " <div class='col-2 text-center border border-gray-400'><span class='text-xs'>3.7</span>    </div>    <div class='col-3 text-center text-center border border-gray-400'>/span>    </div>    <div class='col-3 text-center border border-gray-400'><span class='text-xs'>23.5</span>    </div>    <div class='col-3 text-center border border-gray-400'><span class='text-xs'>27.1</span>";
                content += " </div>    <div class='col-2 text-center border border-gray-400'><span class='text-xs'>°C</span>    </div>    <div class='col-2 text-center'><i class='fas fa-thermometer-empty'></i>    </div>    <div class='col-2 text-center border border-gray-400'><span class='text-xs'>1.3</span>    </div> ";
                content += "   <div class='col-3 text-center border border-gray-400'><span class='text-xs'>0.9</span>    </div>    <div class='col-3 text-center border border-gray-400'><span class='text-xs'>-8.8</span>    </div>    <div class='col-2 text-center border border-gray-400'><span class='text-xs'>°C</span>    </div>    <div class='col-2 text-center'><i class='fas fa-wind'></i>    </div>    <div class='col-2 text-center border border-gray-400'><span class='text-xs'>8.8</span>    </div>";
                content += "    <div class='col-3 text-center border border-gray-400'><span class='text-xs'>8.8</span>    </div>    <div class='col-3 text-center border border-gray-400'><span class='text-xs'>16.8</span>    </div>    <div class='col-2 text-center border border-gray-400'><span class='text-xs'>m/s</span>    </div></div></div>";
                content += "</div>";
                document.getElementById("informacion").innerHTML = content;
            });''
            // Agregar el marker al arreglo

            makersCountersArray.push(markerCounter);
        }
        cont = cont + 1;

    });
}


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

