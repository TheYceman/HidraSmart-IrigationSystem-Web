

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
    zoom: 9,
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
    console.log(contadores);
    estaciones = [
        {
            "id": "EM1-02: EL BONILLO",
            "coorY": -2.52529,
            "coorX": 38.95087,
            "T": "20.4 ºC",
            "P": "0.0 mm",
            "V": "0.0 mmh",
        },
        {
            "id": "EM1-05: MANZANARES",
            "coorY": -3.3644,
            "coorX": 39.00211,
            "T": "20.4 ºC",
            "P": "0.0 mm",
            "V": "0.0 mmh",
        },
        {
            "id": "EM1-03: OSSA DE MONTIEL",
            "coorY": -2.72396,
            "coorX": 38.94659,
            "T": "20.4 ºC",
            "P": "0.0 mm",
            "V": "0.0 mmh",
        },
        {
            "id": "EM1-020: BOLAÑOS DE CALATRAVA",
            "coorY": -3.64649,
            "coorX": 38.89531,
            "T": "20.4 ºC",
            "P": "0.0 mm",
            "V": "0.0 mmh",
        }, {
            "id": "EM1-18: VALDEPEÑAS",
            "coorY": -3.39385,
            "coorX": 38.73695,
            "T": "20.4 ºC",
            "P": "0.0 mm",
            "V": "0.0 mmh",
        }, {
            "id": "EM1-15: VILLARRUBIA DE LOS OJOS",
            "coorY": -3.55863,
            "coorX": 39.18543,
            "T": "20.4 ºC",
            "P": "0.0 mm",
            "V": "0.0 mmh",
        }
        , {
            "id": "EM1-14: CARRASCOSA DE HAR0",
            "coorY": -2.62237,
            "coorX": 39.57156,
            "T": "20.4 ºC",
            "P": "0.0 mm",
            "V": "0.0 mmh",
        }


    ]
    estaciones.forEach(estacion => {
        if (cont < 60) {
            //console.log("Coordenada X:", estacion.coorX);
            //console.log("Coordenada Y:", estacion.coorY);

            var iconUrl = "/images/mapa_sig/station.png";
            // Obtener las coordenadas
            var coorY = parseFloat(estacion.coorY);
            var coorX = parseFloat(estacion.coorX);
            var markerCounter = new google.maps.Marker({
                position: { lat: coorX, lng: coorY },
                map: myMap,
                icon: {
                    url: iconUrl,
                    scaledSize: new google.maps.Size(40, 40),
                },
                title: estacion.id,
            });
            // Agregar evento de clic al marker
            markerCounter.addListener("click", function (event) {

                var content = `
                <div class="infowindow-content">
                    <div class="header">
                        <b>${estacion.id}</b>
                    </div>
                    <div class="section">
                        <div class="section-title"><b>Datos diarios</b></div>
                        <div class="input-group">
                            <div class="input-row">
                                <input type="date" id="fecha_inicio" name="fecha_inicio" class="input-date" value="2024-05-07">
                            </div>
                            <div class="input-row">
                                <input type="date" id="fecha_fin" name="fecha_fin" class="input-date" value="2024-05-16">
                            </div>
                            <button id="datos_diarios_btn" type="button" class="btn-icon" onclick="consultaDatosDiarios()">
                                <i class="fas fa-search" style="color: #fff"></i>
                            </button>
                        </div>
                    </div>
                    <div class="section">
                        <div class="section-title"><b>Datos históricos</b></div>
                        <div class="input-group">
                            <label for="anio_historico" class="label-anio">Año</label>
                            <input id="anio_historico" type="number" class="input-number" min="1999" step="1" max="2024" value="2023">
                        </div>
                    </div>
                    <div class="button-row">
                        <button type="button" class="btn-icon" onclick="consultaDatosHistoricos(1)" title="Precipitación, ETo">
                            <i class="fas fa-cloud-showers-heavy" style="color: #fff"></i>
                        </button>
                        <button type="button" class="btn-icon" onclick="consultaDatosHistoricos(2)" title="Termometría">
                            <i class="fas fa-thermometer-three-quarters" style="color: #fff"></i>
                        </button>
                        <button type="button" class="btn-icon" onclick="consultaDatosHistoricos(3)" title="Higrometría">
                            <i class="fas fa-water" style="color: #fff"></i>
                        </button>
                        <button type="button" class="btn-icon" onclick="consultaDatosHistoricos(4)" title="Viento">
                            <i class="fas fa-wind" style="color: #fff"></i>
                        </button>
                    </div>
                </div>`;


                show_infowindow_plots(event, content);
                document.getElementById("informacion").style.display = "block";
                content = "<div class='leyenda-container'>";
                content += "<span id='leyendaLabel'><b>Información de la estación</b></span>";
                content += "<div>";
                content += "<div>";
                content += "<div class='ol-popup-content'><div style='width: 100%;background-color: #3c8dbc;color: #ffffff; padding-left: 4px; padding: 4px; font-weight:bold'>" + estacion.id + "</div><div class='flex ml-2 mr-2 mt-1'><div class='flex-auto text-xs'>  ";
                content += "<b>Instalación:</b> 20/12/2000 </div><div class='flex-auto text-xs'><b>Altitud:</b> 1109 m</div></div><div class='flex ml-2 mr-2'>    <div class='flex-auto text-xs'>        <b>Datos:</b> 22/12/2000 - 19/05/2024    </div></div><div class='flex ml-2 mr-2'><div class='flex-auto text-xs'><b>Estado:</b> Activa";
                content += "</div><div class='flex-auto text-xs'><b>Información:</b> Actualizada</div></div>";
                content += "<br/>";
                content += "<div class='grid-container'>";
                content += "<div class='grid-item2'></div>";
                content += "<div class='grid-item'><span class='text-xs font-bold'>Ayer</span></div>";
                content += "<div class='grid-item'><span class='text-xs font-bold'>7 días</span></div>";
                content += "<div class='grid-item'><span class='text-xs font-bold'>Año</span></div>";
                content += "<div class='grid-item2'></div>";

                content += "<div class='grid-item'><i class='fas fa-cloud-showers-heavy'></i></div>";
                content += "<div class='grid-item'><span class='text-xs'>3.7</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>23.5</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>27.1</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>°C</span></div>";

                content += "<div class='grid-item'><i class='fas fa-thermometer-empty'></i></div>";
                content += "<div class='grid-item'><span class='text-xs'>1.3</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>0.9</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>-8.8</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>°C</span></div>";

                content += "<div class='grid-item'><i class='fas fa-wind'></i></div>";
                content += "<div class='grid-item'><span class='text-xs'>8.8</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>8.8</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>16.8</span></div>";
                content += "<div class='grid-item'><span class='text-xs'>m/s</span></div>";
                content += "</div>";

                content += "</div></div>";

                document.getElementById("informacion").innerHTML = content;
                var content = ' <div class="wb-body" style="margin: 4px;"><div id="Datos_Historicos_winbox">';
                content = content + '<div class="row m-4">';
                content = content + '     <div id="hist_chart_div" class="col-lg-6 col-12 col-6"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>';
                content = content + '         <canvas id="hist_chart" width="914" height="400" style="min-height: 400px !important; display: block; touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); width: 914px; height: 400px;" class="chartjs-render-monitor"></canvas>';
                content = content + '</div>';
                content = content + '<div id="hist_table_div" class="col-lg-6 col-12 col-6"><table class="table-auto w-full text-center"><thead><tr><th class="border-2 border-primary-1 bg-primary-1 text-white">Mes</th><th class="border-2 border-primary-1 bg-primary-1 text-white" title="Fecha humedad máxima absoluta">Fecha HMA</th><th class="border-2 border-primary-1 bg-primary-1 text-white" title="Humedad máxima absoluta">HMA (%)</th><th class="border-2 border-primary-1 bg-primary-1 text-white" title="Fecha humedad mínima absoluta">Fecha hma</th><th class="border-2 border-primary-1 bg-primary-1 text-white" title="Humedad mínima absoluta">hma (%)</th><th class="border-2 border-primary-1 bg-primary-1 text-white" title="Humedad media de medias">Hmm (%)</th><th class="border-2 border-primary-1 bg-primary-1 text-white" title="Humedad media de mínimas">hmm (%)</th><th class="border-2 border-primary-1 bg-primary-1 text-white" title="Humedad media de máximas">HMM (%)</th></tr></thead><tbody><tr><td class="border-2 border-primary-1">Enero</td><td class="border-2 border-primary-1">15/01/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">01/01/2023</td><td class="border-2 border-primary-1">27.3</td><td class="border-2 border-primary-1">73.8</td><td class="border-2 border-primary-1">56.5</td><td class="border-2 border-primary-1">89.1</td></tr><tr><td class="border-2 border-primary-1">Febrero</td><td class="border-2 border-primary-1">13/02/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">04/02/2023</td><td class="border-2 border-primary-1">22.0</td><td class="border-2 border-primary-1">61.4</td><td class="border-2 border-primary-1">41.3</td><td class="border-2 border-primary-1">81.7</td></tr><tr><td class="border-2 border-primary-1">Marzo</td><td class="border-2 border-primary-1">05/03/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">29/03/2023</td><td class="border-2 border-primary-1">13.2</td><td class="border-2 border-primary-1">54.6</td><td class="border-2 border-primary-1">34.8</td><td class="border-2 border-primary-1">74.7</td></tr><tr><td class="border-2 border-primary-1">Abril</td><td class="border-2 border-primary-1">22/04/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">04/04/2023</td><td class="border-2 border-primary-1">6.1</td><td class="border-2 border-primary-1">35.5</td><td class="border-2 border-primary-1">19.7</td><td class="border-2 border-primary-1">57.4</td></tr><tr><td class="border-2 border-primary-1">Mayo</td><td class="border-2 border-primary-1">23/05/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">03/05/2023</td><td class="border-2 border-primary-1">9.6</td><td class="border-2 border-primary-1">50.5</td><td class="border-2 border-primary-1">31.0</td><td class="border-2 border-primary-1">70.0</td></tr><tr><td class="border-2 border-primary-1">Junio</td><td class="border-2 border-primary-1">02/06/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">29/06/2023</td><td class="border-2 border-primary-1">12.8</td><td class="border-2 border-primary-1">55.8</td><td class="border-2 border-primary-1">35.9</td><td class="border-2 border-primary-1">76.6</td></tr><tr><td class="border-2 border-primary-1">Julio</td><td class="border-2 border-primary-1">15/07/2023</td><td class="border-2 border-primary-1">69.4</td><td class="border-2 border-primary-1">07/07/2023</td><td class="border-2 border-primary-1">6.2</td><td class="border-2 border-primary-1">28.1</td><td class="border-2 border-primary-1">14.0</td><td class="border-2 border-primary-1">43.7</td></tr><tr><td class="border-2 border-primary-1">Agosto</td><td class="border-2 border-primary-1">03/08/2023</td><td class="border-2 border-primary-1">71.5</td><td class="border-2 border-primary-1">13/08/2023</td><td class="border-2 border-primary-1">1.6</td><td class="border-2 border-primary-1">25.6</td><td class="border-2 border-primary-1">12.6</td><td class="border-2 border-primary-1">42.9</td></tr><tr><td class="border-2 border-primary-1">Septiembre</td><td class="border-2 border-primary-1">03/09/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">01/09/2023</td><td class="border-2 border-primary-1">20.0</td><td class="border-2 border-primary-1">57.8</td><td class="border-2 border-primary-1">38.2</td><td class="border-2 border-primary-1">78.2</td></tr><tr><td class="border-2 border-primary-1">Octubre</td><td class="border-2 border-primary-1">15/10/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">07/10/2023</td><td class="border-2 border-primary-1">18.4</td><td class="border-2 border-primary-1">61.8</td><td class="border-2 border-primary-1">46.6</td><td class="border-2 border-primary-1">77.6</td></tr><tr><td class="border-2 border-primary-1">Noviembre</td><td class="border-2 border-primary-1">14/11/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">25/11/2023</td><td class="border-2 border-primary-1">24.4</td><td class="border-2 border-primary-1">77.9</td><td class="border-2 border-primary-1">60.7</td><td class="border-2 border-primary-1">91.6</td></tr><tr><td class="border-2 border-primary-1">Diciembre</td><td class="border-2 border-primary-1">01/12/2023</td><td class="border-2 border-primary-1">100.0</td><td class="border-2 border-primary-1">23/12/2023</td><td class="border-2 border-primary-1">29.9</td><td class="border-2 border-primary-1">78.7</td><td class="border-2 border-primary-1">61.6</td><td class="border-2 border-primary-1">91.8</td></tr><tr><td class="border-2 border-primary-1 bg-primary-1 text-white">AÑO 2023</td><td class="border-2 border-primary-1 bg-primary-1 text-white">15/01/2023</td><td class="border-2 border-primary-1 bg-primary-1 text-white">100.0</td><td class="border-2 border-primary-1 bg-primary-1 text-white">13/08/2023</td><td class="border-2 border-primary-1 bg-primary-1 text-white">1.6</td><td class="border-2 border-primary-1 bg-primary-1 text-white">54.5</td><td class="border-2 border-primary-1 bg-primary-1 text-white">37.1</td><td class="border-2 border-primary-1 bg-primary-1 text-white">72.3</td></tr></tbody></table></div>';
                content = content + '</div>';
                content = content + '</div></div>';
                //document.getElementById("informacion").innerHTML = content;
            }); ''
            // Agregar el marker al arreglo

            makersCountersArray.push(markerCounter);
        }
        cont = cont + 1;

    });
}


function consultaDatosHistoricos(tipo) {
    document.getElementById('info-meteorologica').style.display = "block";
}

function closeInfo() {
    document.getElementById('info-meteorologica').style.display = 'none';
}

/**VENTANA EMERGENTE */
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                label: 'Precipitación (mm)',
                data: [21.7, 5.3, 13.4, 5.3, 25.6, 73.5, 0, 6.7, 49.8, 73.9, 37.2, 40.6],
                borderColor: 'blue',
                fill: false
            },
            {
                label: 'ETo (mm)',
                data: [32.8, 53.2, 90.0, 130.0, 139.0, 151.1, 233.1, 197.0, 112.0, 74.9, 33.9, 22.4],
                borderColor: 'red',
                fill: false
            }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'mm'
                }
            }
        }
    }
});

/*FIN VENTANA*/
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

