var myMap;

var makersCountersArray=[];
var infowindow = new google.maps.InfoWindow();
var infowindowMeteo = new google.maps.InfoWindow();
// Coordenadas
const targetLongitude = -3.070035423095705;
const targetLatitude = 39.1430930560515;

//Capas de variables

var currentLayer = null;
var currentMarkers = [];
var selectedLayer = null;

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

/** Temperatura **/
function toggleLayer(layerName, paintFunction) {
    // Ocultar la capa previamente seleccionada
    if (selectedLayer) {
        document.getElementById('toggle-' + selectedLayer).classList.remove('selected');
        clearMarkers();
    }

    // Si se seleccionó una capa diferente, mostrarla
    if (selectedLayer !== layerName) {
        paintFunction();
        document.getElementById('toggle-' + layerName).classList.add('selected');
        selectedLayer = layerName;
    } else {
        // Si se seleccionó la misma capa, deseleccionarla
        selectedLayer = null;
    }
}

function clearMarkers() {
    for (var i = 0; i < currentMarkers.length; i++) {
        currentMarkers[i].setMap(null);
    }
    currentMarkers = [];
}

function getMarkerColor(value) {
    if (value <= 5) {
        return '#ADD8E6'; // Azul clarito
    } else if (value <= 10) {
        return '#FFFF00'; // Amarillo
    } else if (value <= 20) {
        return '#FFA500'; // Naranja
    } else if (value <= 30) {
        return '#FF8C00'; // Naranja oscuro
    } else {
        return '#FF0000'; // Rojo
    }
}

function paint_temp() {
    fetch("json/temperatura.geojson")
        .then((response) => response.json())
        .then(function (data) {
            if (Array.isArray(data.features)) {
                data.features.forEach(function (feature) {
                    var temperature = feature.properties.Tempta;
                    var municipio = feature.properties.Municipio;
                    var coordenada = feature.geometry.coordinates;
                    var position = new google.maps.LatLng(coordenada[1], coordenada[0]);
                    if (temperature !== "" ) {
                        var marker = new google.maps.Marker({
                            position: position,
                            map: myMap,
                            label: {
                                text: String(temperature),
                                color: '#000000',
                                fontWeight: 'bold'
                            },
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: getMarkerColor(temperature),
                                fillOpacity: 1,
                                strokeWeight: 1
                            }
                        });
                       
                        currentMarkers.push(marker);
                    
                        var infowindowMeteo = new google.maps.InfoWindow({
                            content: '<div class="custom-iw">' + municipio + '</div><div>Temperatura: ' + temperature + ' ºC</div>'
                        });

                        marker.addListener('mouseover', function () {
                            infowindowMeteo.open(map, marker);
                            google.maps.event.addListenerOnce(infowindowMeteo, 'domready', function () {
                                var iwOuter = document.querySelector('.gm-style-iw');
                                iwOuter.classList.add('custom-iw');
                            });
                        });

                        marker.addListener('mouseout', function () {
                            infowindowMeteo.close();
                        });
                    }
                });
            } else {
                console.log('El array features no existe en el GeoJSON.');
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}

function paint_preci() {
    console.log("paint_preci");
    fetch("json/precipitacion.geojson")
        .then((response) => response.json())
        .then(function (data) {
            if (Array.isArray(data.features)) {
                data.features.forEach(function (feature) {
                    var precipitacion = feature.properties.cPrecp;
                    var municipio = feature.properties.Municipio;
                    var coordenada = feature.geometry.coordinates;
                    var position = new google.maps.LatLng(coordenada[1], coordenada[0]);

                    if (precipitacion !== "") {
                        var marker = new google.maps.Marker({
                            position: position,
                            map: myMap,
                            label: {
                                text: String(precipitacion),
                                color: '#000000',
                                fontWeight: 'bold'
                            },
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: getMarkerColor(precipitacion),
                                fillOpacity: 1,
                                strokeWeight: 1
                            }
                        });
                        currentMarkers.push(marker);

                        var infowindowMeteo = new google.maps.InfoWindow({
                            content: '<div class="custom-iw">' + municipio + '</div><div> ' + precipitacion + ' mm</div>'
                        });

                        marker.addListener('mouseover', function () {
                            infowindowMeteo.open(map, marker);
                            google.maps.event.addListenerOnce(infowindowMeteo, 'domready', function () {
                                var iwOuter = document.querySelector('.gm-style-iw');
                                iwOuter.classList.add('custom-iw');
                            });
                        });

                        marker.addListener('mouseout', function () {
                            infowindowMeteo.close();
                        });
                    }
                });
            } else {
                console.log('El array features no existe en el GeoJSON.');
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}

function paint_hume() {

    fetch("json/humedad.geojson")
        .then((response) => response.json())
        .then(function (data) {

            if (Array.isArray(data.features)) {
                data.features.forEach(function (feature) {

                    var humedad = feature.properties.humRel;
                    var municipio = feature.properties.Municipio;
                    var coordenada = feature.geometry.coordinates;
                    var position = new google.maps.LatLng(coordenada[1], coordenada[0]);

                    if (humedad !== "") {
                        var marker = new google.maps.Marker({
                            position: position,
                            map: myMap,
                            label: {
                                text: String(humedad),
                                color: '#000000',
                                fontWeight: 'bold'
                            },
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: getMarkerColor(humedad),
                                fillOpacity: 1,
                                strokeWeight: 1
                            }
                        });
                        currentMarkers.push(marker);

                        var infowindowMeteo = new google.maps.InfoWindow({
                            content: '<div class="custom-iw">' + municipio + '</div><div> ' + humedad + ' %</div>'
                        });

                        marker.addListener('mouseover', function () {
                            infowindowMeteo.open(map, marker);
                            google.maps.event.addListenerOnce(infowindowMeteo, 'domready', function () {
                                var iwOuter = document.querySelector('.gm-style-iw');
                                iwOuter.classList.add('custom-iw');
                            });
                        });

                        marker.addListener('mouseout', function () {
                            infowindowMeteo.close();
                        });
                    }
                });
            } else {
                console.log('El array features no existe en el GeoJSON.');
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}

function paint_wind() {
    console.log("paint_wind");
    fetch("json/viento.geojson")
        .then((response) => response.json())
        .then(function (data) {
            if (Array.isArray(data.features)) {
                data.features.forEach(function (feature) {
                    var diVien = feature.properties.diVien;
                    var viVien = feature.properties.viVien;
                    var municipio = feature.properties.Municipio;
                    var coordenada = feature.geometry.coordinates;
                    var position = new google.maps.LatLng(coordenada[1], coordenada[0]);

                    if (viVien !== "") {
                        var marker = new google.maps.Marker({
                            position: position,
                            map: myMap,
                            label: {
                                text: String(viVien),
                                color: '#000000',
                                fontWeight: 'bold'
                            },
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: getMarkerColor(viVien),
                                fillOpacity: 1,
                                strokeWeight: 1
                            }
                        });
                        currentMarkers.push(marker);

                        var infowindowMeteo = new google.maps.InfoWindow({
                            content: '<div class="custom-iw">' + municipio + '</div><div> Dirección: ' + diVien + '</div><div> Viento: ' + viVien + ' km/h</div>'
                        });

                        marker.addListener('mouseover', function () {
                            infowindowMeteo.open(map, marker);
                            google.maps.event.addListenerOnce(infowindowMeteo, 'domready', function () {
                                var iwOuter = document.querySelector('.gm-style-iw');
                                iwOuter.classList.add('custom-iw');
                            });
                        });

                        marker.addListener('mouseout', function () {
                            infowindowMeteo.close();
                        });
                    }
                });
            } else {
                console.log('El array features no existe en el GeoJSON.');
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}

function paint_storm() {
    console.log("paint_storm");
    fetch("json/tormenta.geojson")
        .then((response) => response.json())
        .then(function (data) {
            if (Array.isArray(data.features)) {
                data.features.forEach(function (feature) {
                    var probTo = feature.properties.probTo;
                    var municipio = feature.properties.Municipio;
                    var coordenada = feature.geometry.coordinates;
                    var position = new google.maps.LatLng(coordenada[1], coordenada[0]);

                    if (probTo !== "") {
                        var marker = new google.maps.Marker({
                            position: position,
                            map: myMap,
                            label: {
                                text: String(probTo),
                                color: '#000000',
                                fontWeight: 'bold'
                            },
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: getMarkerColor(probTo),
                                fillOpacity: 1,
                                strokeWeight: 1
                            }
                        });
                        currentMarkers.push(marker);

                        var infowindowMeteo = new google.maps.InfoWindow({
                            content: '<div class="custom-iw">' + municipio + '</div><div> ' + probTo + ' %</div>'
                        });

                        marker.addListener('mouseover', function () {
                            infowindowMeteo.open(map, marker);
                            google.maps.event.addListenerOnce(infowindowMeteo, 'domready', function () {
                                var iwOuter = document.querySelector('.gm-style-iw');
                                iwOuter.classList.add('custom-iw');
                            });
                        });

                        marker.addListener('mouseout', function () {
                            infowindowMeteo.close();
                        });
                    }
                });
            } else {
                console.log('El array features no existe en el GeoJSON.');
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
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


