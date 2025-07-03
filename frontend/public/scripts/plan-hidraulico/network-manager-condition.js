//const dataNodesNetwork = getDataNodesNetwork;
// network-manager-condition.js
var myMapCondition;

var tanksArray = [];
let infoWindowsTanks = {};
let toggleTanks = false;

var nodeNetworkArray = [];
let nodeWithFlowNetworkArray = [];
let infoWindowsNodos = {};
let toggleNodes = false;
let dataShowAffectedNodesIndexadaCondition = {};

let trafficConductionsArray = [];
let infoWindowsConductions = {};
let arrowConductionsArray = [];
let toggleConductions = false;
let strokeWeightConductions = 2;
let dataShowAffectedConductionsIndexadaCondition = {};

var valveArray = [];
let infoWindowsValves = {};
var markerValve;
let toggleValves = false;

let plotsArray = [];
let currentInfowindow = null;
let currentHighLightNode = null;
var catalogedNodesPlots = {};
var markers = [];
var clustersMarkers;
var markerCluster;
let infoWindowsPlots = {};
let togglePlots = false;
let dataShowAffectedPlotsIndexadaCondition = {};


let leftLegendHTML;
let propertiesWithColors;

let dateExtractionMatiz = [];
let dateExtraction = false;

let dateExtractionRangesMatiz = [];
let dateHistoricalExtractionMatiz = [];

var customMapStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }] // Oculta los labels de los puntos de interés
    },
    {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }] // Oculta los labels de los transportes públicos
    },
    {
        featureType: "road",
        elementType: "labels",
        stylers: [{ visibility: "off" }] // Oculta los labels de las carreteras
    }
];

/* sección [Mapa de Google] Cargar API key*/

function loadGoogleMapsScript() {
    const apiKey = window.VITE_GOOGLE_MAPS_API_KEY;
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
            return;
        }

        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log("Google Maps script loaded");
            resolve();
        };
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
}
/* [Fin de sección] */


/* sección [Mapa de Google] iniciar mapa */

async function initializeMap() {

    const targetZoom = window.userData.user.targetZoom;
    const targetLatitude = window.userData.user.targetLatitude;
    const targetLongitude = window.userData.user.targetLongitude;

    const { Map } = await google.maps.importLibrary("maps");

    myMapCondition = new Map(document.getElementById("container-map-condition"), {
        zoom: targetZoom,
        streetViewControl: false,
        center: { lat: targetLatitude, lng: targetLongitude },
        mapTypeId: 'terrain',
    });

    myMapCondition.addListener('zoom_changed', () => {
        const currentZoom = myMapCondition.getZoom();
        // Add zoom logic here if needed
    });

    createLegend();
    //await paint_nodes();
    //paint_conductions();
    //paint_plots();
    //paint_valves();
    //paint_tanks();
    //center_map();
}

/* [Fin de sección] */


// Inicio funciones de depósitos

function paint_tanks(property) {
    var color;
    var contentString;
    getAllDataTank.forEach(tank => {
        if (toggleTanks) {
            dateExtractionMatiz.depositosout.data.rows.forEach(tanks => {
                if (tank.id === tanks.id) {
                    color = getColorForCota(tanks[property], property);
                    contentString = showGrafic('Depósito', tank.id, property, tanks[property]);
                }
            });
        } else {
            color = 'black';
            contentString = showGrafic('Depósito', tank.id);
        }
        const position = tank.geometrygood;
        const tankMarker = new google.maps.Marker({
            position: { lat: position.x, lng: position.y },
            map: myMapCondition,
            icon: {
                url: '/images/icons/marker_tank_' + color + '.png', // URL del icono
                scaledSize: new google.maps.Size(38, 38) // Tamaño del icono
            }
        });
        const infowindow = new google.maps.InfoWindow({ content: contentString });
        tankMarker.addListener("click", () => {
            if (currentInfowindow) {
                currentInfowindow.close();
            }

            infowindow.open(myMapCondition, tankMarker);
            currentInfowindow = infowindow;
        });
        tanksArray.push(tankMarker);
        infoWindowsTanks[tank.id] = infowindow;
        google.maps.event.addListenerOnce(infowindow, 'domready', function () {
            document.querySelectorAll('.button_historical').forEach(button => {
                button.addEventListener('click', function () {
                    historicalExtraction('depositosout', tank.id, 'toggleTanks')
                });
            });
        });
    });
}

function clear_paint_tanks() {
    tanksArray.forEach(tankMarker => {
        tankMarker.setMap(null);
    });
    tanksArray = [];
}

// Fin funciones de depósitos

// Inicio funciones de nodos

async function paint_nodes() {
    nodeNetworkArray = [];
    dataNodesNetwork.forEach(node => {
        const position = node.geometrygood;
        const color = 'black';
        // Crear un icono personalizado para cada nodo
        const iconoPersonalizado = {
            url: `data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="4" fill="${color}" /></svg>`,
            scaledSize: new google.maps.Size(8, 8)  // Tamaño del punto
        };

        const marker = new google.maps.Marker({
            color: color,
            position: { lat: position.x, lng: position.y },
            title: node.id.toString(),
            icon: iconoPersonalizado,
            id: node.id,
            originalDimension: node.cota,
            zIndex: 1100,
        });
        const contentString = showGrafic('Nodo', node);
        const infowindow = new google.maps.InfoWindow({ content: contentString });
        marker.addListener("click", () => {
            if (currentInfowindow) {
                currentInfowindow.close();
            }

            infowindow.open(myMapCondition, marker);
            currentInfowindow = infowindow;
        });

        nodeNetworkArray.push(marker);
        infoWindowsNodos[node.id] = infowindow;
        google.maps.event.addListenerOnce(infowindow, 'domready', function () {
            document.querySelectorAll('.button_historical').forEach(button => {
                button.addEventListener('click', function () {
                    historicalExtraction('nodosout', node.id, 'toggleNodes')
                });
            });
        });
    });

    markerCluster = new MarkerClusterer(myMapCondition, nodeNetworkArray, {
        imagePath: '/images/icons/icon-marker-clusterer-blue',
        styles: [{
            height: 53,
            width: 53,
            textColor: 'black',
            textSize: 14,
            marginTop: 19,
            url: getGoogleClusterInlineSvg('#999'), // Asegúrate de que esta ruta es correcta
        }],
        gridSize: 50,
        maxZoom: 16,
        title: 'node'
    });

    google.maps.event.addListener(markerCluster, 'clusteringend', function (clusterer) {
        clustersMarkers = clusterer.getClusters();
    });

}

var getGoogleClusterInlineSvg = function (color) {
    var encoded = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200"><defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.7"/><path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.5"/><path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.3"/></g></defs><g fill="' + color + '"><circle r="42"/><use xlink:href="#a"/><g transform="rotate(120)"><use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>');

    return ('data:image/svg+xml;base64,' + encoded);
};

// Función para pintar los nodos del mapa
async function activation_deactivation_node_property(property) {
    // Indexar nodos por ID
    dateExtractionMatiz.nodosout.data.rows.forEach(row => {
        dataShowAffectedNodesIndexadaCondition[row.id] = row;
    });

    for (const marker of nodeNetworkArray) {
        const nodes = dataShowAffectedNodesIndexadaCondition[marker.id];
        if (!nodes) continue; // Evita errores si no hay datos para este nodo

        let color;
        let contentString;

        if (!toggleNodes) {
            color = 'black';
            marker.color = color;
            marker.cota = null;
            marker.property = null;
            contentString = showGrafic('Nodo', { id: marker.id }); // Solo ID
        } else {
            color = getColorForCota(nodes[property], property);
            marker.cota = nodes[property];
            marker.property = property;
            marker.color = color;
            contentString = showGrafic('Nodo', { id: marker.id }, property, nodes[property]);

        }

        // Actualizar ícono
        const iconoPersonalizado = {
            url: `data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="4" fill="${color}" /></svg>`,
            scaledSize: new google.maps.Size(8, 8)
        };
        marker.setIcon(iconoPersonalizado);

        // Actualizar contenido del InfoWindow si está abierto
        const infowindow = infoWindowsNodos[marker.id];
        if (infowindow && currentInfowindow === infowindow) {
            infowindow.setContent(contentString);
            infowindow.open(myMapCondition, marker);
            google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                document.querySelectorAll('.button_historical').forEach(button => {
                    button.addEventListener('click', function () {
                        historicalExtraction('nodosout', marker.id, 'toggleNodes');
                    });
                });
            });
        }
    }
}


// Función para ocultar los nodos y grupos de nodos del mapa
function clear_nodes_network() {
    nodeNetworkArray.forEach(marker => {

        if (typeof marker.setVisible === 'function') {
            marker.setVisible(false);
        } else {
            console.error('El objeto marker no tiene el método setVisible:', marker);
        }
    });
    // Ocultar todos los marcadores dentro de los clusters
    markerCluster.getMarkers().forEach(marker => {
        if (marker instanceof google.maps.Marker) {
            marker.setVisible(false);
        }
    });
    markerCluster.clearMarkers();
}

// Función para mostrar los nodos y grupos de nodos del mapa
function show_nodes_network() {
    nodeNetworkArray.forEach(marker => {
        if (typeof marker.setVisible === 'function') {
            const infowindow = infoWindowsNodos[marker.id];
            if (infowindow) {
                const contentString = showGrafic('Nodo', marker);
                infowindow.setContent(contentString);
            }
            marker.setVisible(true);
            const iconoPersonalizado = {
                url: `data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="4" fill="black" /></svg>`,
                scaledSize: new google.maps.Size(8, 8)  // Tamaño del punto
            };

            marker.setIcon(iconoPersonalizado);
            google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                document.querySelectorAll('.button_historical').forEach(button => {
                    button.addEventListener('click', function () {
                        historicalExtraction('nodosout', marker.id, 'toggleNodes')
                    });
                });
            });
        } else {
            console.error('El objeto marker no tiene el método setVisible:', marker);
        }
    });

    // Volver a agregar los marcadores al MarkerClusterer
    markerCluster.addMarkers(nodeNetworkArray);
}

function drawPurges(purgedNodes) {
    // Iterar sobre los nodos y dibujar los marcadores
    nodeNetworkArray.forEach(node => {
        const color = node.color;
        // Verificar si el nodo está en la lista de nodos con caudal
        const nodoConCaudal = purgedNodes.find(nodo => nodo.Nodo === node.id);

        // Si el nodo tiene caudal, le colocamos un icono encima del punto del nodo
        if (nodoConCaudal) {
            node.caudal = nodoConCaudal.Caudal_Equivalente;
            contentString = showGrafic('Nodo', node);
            const infowindow = infoWindowsNodos[node.id];
            if (infowindow) {
                infowindow.setContent(contentString);
            }

            const iconoPersonalizado = {
                url: `/images/icons/icon-purge-node.svg`,
                scaledSize: new google.maps.Size(28, 35)  // Tamaño combinado
            }
            // Crear el marcador en el mapa
            const marker = new google.maps.Marker({
                position: node.position,
                title: node.id.toString(),
                icon: iconoPersonalizado,
                id: node.id,
                originalDimension: node.cota,
                zIndex: 1050,
            });
            nodeWithFlowNetworkArray.push(marker);
            // Añadir el marcador al mapa (asumiendo que myMapCondition es tu mapa de Google)
            marker.setMap(myMapCondition);
        };


    });
}

function deletePurges() {
    nodeWithFlowNetworkArray.forEach(nodeWithFlow => {
        nodeWithFlow.setMap(null);
    });
    nodeNetworkArray.forEach(node => {
        const nodoConCaudal = nodeWithFlowNetworkArray.find(nodeWithFlow => nodeWithFlow.id === node.id);
        if (nodoConCaudal) {
            node.caudal = null;
            contentString = showGrafic('Nodo', node);
            const infowindow = infoWindowsNodos[node.id];
            if (infowindow) {
                infowindow.setContent(contentString);
            }
            nodoConCaudal.setMap(null);
        }
    });
    nodeWithFlowNetworkArray = [];
}

// Fin funciones de nodos

// Inicio funciones de conducciones

function paint_conductions() {
    const dataTrafficConductions = getDataTrafficConductions;

    dataTrafficConductions.forEach(conduction => {
        let coordinates = searchStartEnd(conduction.ninicio, conduction.nfinal)
        const conductionCoords = []; // Array para almacenar las coordenadas de los puntos de la tubería
        // Obtener las coordenadas de los puntos de la tubería y agregarlas al array conductionCoords
        coordinates.forEach(coord => {
            // Convertir las coordenadas a números
            const lat = parseFloat(coord.y);
            const lng = parseFloat(coord.x);

            // Verificar si las coordenadas son números válidos
            if (!isNaN(lat) && !isNaN(lng)) {
                conductionCoords.push({
                    lat: lat,
                    lng: lng
                });
            } else {
                console.error("Coordenadas inválidas:", coord);
            }
        });
        // Crear una polilínea con las coordenadas de la tubería
        const polyline = new google.maps.Polyline({
            id: conduction.id,
            path: conductionCoords,
            geodesic: true,
            strokeColor: "black", // Color de la línea
            strokeOpacity: 1.0, // Opacidad de la línea
            strokeWeight: strokeWeightConductions, // Grosor de la línea
            material: conduction.material,
            diameter: conduction.diametro / 1000,
            length: conduction.longitud,
            zIndex: 1000,
        });
        // Agregar la polilínea al mapa y a la variable global
        polyline.setMap(myMapCondition);
        const contentString = showGrafic('Conducción', conduction.id);
        let infowindow = new google.maps.InfoWindow({ content: contentString });
        infoWindowsConductions[conduction.id] = infowindow;
        polyline.addListener("click", () => {
            const midPoint = getPolylineMidPoint(polyline);
            const infowindow = infoWindowsConductions[conduction.id];

            if (currentInfowindow) {
                currentInfowindow.close();
            }

            let contentString;
            if (toggleConductions && polyline.property && polyline.cota !== undefined) {
                contentString = showGrafic('Conducción', polyline, polyline.property, polyline.cota);
            } else {
                contentString = showGrafic('Conducción', { id: conduction.id });
            }

            infowindow.setContent(contentString);
            infowindow.setPosition(midPoint);
            infowindow.open(myMapCondition, polyline);
            currentInfowindow = infowindow;

            // Solo si hay propiedad activa se añade botón
            if (toggleConductions && polyline.property) {
                google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                    document.querySelectorAll('.button_historical').forEach(button => {
                        button.addEventListener('click', function () {
                            historicalExtraction('conduccionesout', polyline.id, 'toggleConductions');
                        });
                    });
                });
            }
        });

        trafficConductionsArray.push(polyline);

    });
}

function searchStartEnd(inicio, fin) {
    let coordenadasInicio;
    let coordenadasFin;
    dataNodesNetwork.forEach(function (node) {
        if (node.id === inicio) {
            coordenadasInicio = node.geometrygood;
        }
        if (node.id === fin) {
            coordenadasFin = node.geometrygood;
        }
    });
    if (typeof coordenadasInicio === 'undefined' || typeof coordenadasFin === 'undefined') {
        getAllDataTank.forEach(tank => {
            if (tank.id === inicio) {
                coordenadasInicio = tank.geometrygood;
            }
            if (tank.id === fin) {
                coordenadasFin = tank.geometrygood;
            }
        });
    }
    let coordenatesarray = [{ x: coordenadasInicio.y, y: coordenadasInicio.x }, { x: coordenadasFin.y, y: coordenadasFin.x }];
    return coordenatesarray;
}

// Función para calcular el punto medio de una polyline
function getPolylineMidPoint(polyline) {
    const path = polyline.getPath();

    const length = google.maps.geometry.spherical.computeLength(path);
    let dist = 0;
    let midPoint;

    for (let i = 0; i < path.getLength() - 1; i++) {
        const segmentStart = path.getAt(i);
        const segmentEnd = path.getAt(i + 1);
        const segmentLength = google.maps.geometry.spherical.computeDistanceBetween(segmentStart, segmentEnd);

        if ((dist + segmentLength) >= length / 2) {
            const heading = google.maps.geometry.spherical.computeHeading(segmentStart, segmentEnd);
            midPoint = google.maps.geometry.spherical.computeOffset(segmentStart, (length / 2) - dist, heading);
            break;
        }
        dist += segmentLength;
    }

    return midPoint;
}

function drawArrowFlow() {
    const arrowSize = 20; // Tamaño de la flecha en píxeles (ajústalo según tus necesidades)
    let symbol;

    function calculatePixelDistance(map, latLng1, latLng2) {
        const projection = map.getProjection();
        const point1 = projection.fromLatLngToPoint(latLng1);
        const point2 = projection.fromLatLngToPoint(latLng2);

        const scale = Math.pow(2, map.getZoom());
        const pixel1 = new google.maps.Point(point1.x * scale, point1.y * scale);
        const pixel2 = new google.maps.Point(point2.x * scale, point2.y * scale);

        const distance = Math.sqrt(Math.pow(pixel2.x - pixel1.x, 2) + Math.pow(pixel2.y - pixel1.y, 2));
        return distance;
    }

    function updateArrowVisibility() {
        dateExtractionMatiz.conduccionesout.data.rows.forEach(row => {
            dataShowAffectedConductionsIndexadaCondition[row.id] = row;
        });

        trafficConductionsArray.forEach(conduction => {
            const caudal = dataShowAffectedConductionsIndexadaCondition[conduction.id].caudal;
            if (caudal > 0.0005) {
                symbol = {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // Utilizar la flecha cerrada hacia adelante como símbolo
                    scale: 2, // Escala del símbolo
                    strokeColor: '#FF0000', // Color de la línea del símbolo
                };
            } else if (caudal < -0.0005) {
                symbol = {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, // Utilizar la flecha cerrada hacia adelante como símbolo
                    scale: 2, // Escala del símbolo
                    strokeColor: '#FF0000', // Color de la línea del símbolo
                };
            } else {
                symbol = null;
            }

            if (conduction.getPath().getLength() > 1) {
                const path = conduction.getPath();
                const start = path.getAt(0);
                const end = path.getAt(path.getLength() - 1);
                const distance = calculatePixelDistance(myMapCondition, start, end);

                // Agregar o quitar el símbolo según la longitud en píxeles de la conducción
                conduction.setOptions({
                    icons: distance > arrowSize ? [{
                        icon: symbol,
                        offset: '50%', // Colocar el símbolo en el medio de la conducción
                    }] : []
                });
            }
        });
    }

    // Llamar a la función de actualización inicialmente para configurar las flechas
    updateArrowVisibility();

    // Agregar listener para el evento de zoom del mapa
    myMapCondition.addListener('zoom_changed', () => {
        updateArrowVisibility();
    });
}


function deleteArrowFlow() {
    trafficConductionsArray.forEach(conduction => {
        conduction.setOptions({
            icons: []
        });
    });
}

// Función para ocultar las conducciones del mapa
function clear_conductions() {
    trafficConductionsArray.forEach(polyline => {
        if (typeof polyline.setVisible === 'function') {
            polyline.setVisible(false);
        } else {
            console.error('El objeto polyline no tiene el método setVisible:', polyline);
        }
    });
}

// Función para mostrar las conducciones del mapa
function show_traffic_conductions() {
    trafficConductionsArray.forEach(polyline => {
        if (typeof polyline.setVisible === 'function') {
            polyline.setVisible(true);
            polyline.setOptions({
                strokeColor: 'black'
            });
        } else {
            console.error('El objeto polyline no tiene el método setVisible:', polyline);
        }
    });
}

// Función para colorear las conducciones del mapa
async function activation_deactivation_conductions_property(property) {
    // Transformar la estructura de `rows` para que el `id` sea el índice
    dateExtractionMatiz.conduccionesout.data.rows.forEach(row => {
        dataShowAffectedConductionsIndexadaCondition[row.id] = row;
    });
    trafficConductionsArray.forEach(polyline => {
        let color, contentString;

        if (toggleConductions) {
            const conductions = dataShowAffectedConductionsIndexadaCondition[polyline.id]
            color = getColorForCota(conductions[property], property);
            polyline.cota = conductions[property];
            contentString = showGrafic('Conducción', polyline.id, property, conductions[property]);
        } else {
            color = 'black';
            contentString = showGrafic('Conducción', polyline.id);
        }

        polyline.setOptions({
            strokeColor: color,
            zIndex: 1000,
        });

        // Actualizar el contenido de la InfoWindow
        let infowindow = infoWindowsConductions[polyline.id];
        const midPoint = getPolylineMidPoint(polyline);

        if (infowindow) {
            infowindow.setContent(contentString);
            infowindow.setPosition(midPoint); // Usar el punto medio como posición para la InfoWindow

            // Reabrir la infowindow si estaba abierta
            // if (infowindow.getMap()) {
            //     infowindow.close();
            //     infowindow.open(myMapCondition, polyline);
            // }
        } else {
            infowindow = new google.maps.InfoWindow({
                content: contentString,
                position: midPoint
            });
            polyline.addListener("click", () => {
                if (currentInfowindow) {
                    currentInfowindow.close();
                }
                infowindow.open(myMapCondition, polyline);
                currentInfowindow = infowindow;
            });
            infoWindowsConductions[polyline.id] = infowindow; // Guardar la nueva InfoWindow en el array
        }

        if (infowindow && toggleConductions) {
            google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                document.querySelectorAll('.button_historical').forEach(button => {
                    button.addEventListener('click', function () {
                        historicalExtraction('conduccionesout', polyline.id, 'toggleConductions');
                    });
                });
            });
        }
    });

}


// Fin funciones de conducciones

// Inicio funciones de válvulas

function paint_valves() {
    //const dataAllValve = fetchValves();
    dataAllValve.forEach(valve => {
        const coordinates = valve.geometrygood;
        const valveCoords = []; // Array para almacenar las coordenadas de los puntos de la tubería

        // Obtener las coordenadas de los puntos de la tubería y agregarlas al array valveCoords
        coordinates.forEach(coord => {
            // Convertir las coordenadas a números
            const lat = parseFloat(coord.y);
            const lng = parseFloat(coord.x);

            // Verificar si las coordenadas son números válidos
            if (!isNaN(lat) && !isNaN(lng)) {
                valveCoords.push({
                    lat: lat,
                    lng: lng
                });
            } else {
                console.error("Coordenadas inválidas:", coord);
            }
        });

        // Calcular el punto medio de la línea
        const middleIndex = Math.floor(valveCoords.length / 2);
        const middlePoint = valveCoords[middleIndex];
        if (valve.info === 'No_operativa') {
            var setup = 'grey';
        } else {
            if (valve.estado === 'Open') {
                var setup = 'green';
            } else {
                var setup = 'red';
            }
        }
        // Crear el marcador en el punto medio con el icono deseado
        const marker = new google.maps.Marker({
            position: middlePoint,
            // map: myMapCondition,
            id: valve.id,
            icon: getIconMarkerValveColor('black'),//'/images/icons/marker_valve.svg',
            draggable: false, // Para que el marcador no se pueda mover
            zIndex: 9999, // Asegura que el marcador esté por encima de otras capas
            type: valve.tipo,
            setup: setup,
            diameter: valve.diametro,
        });
        const contentString = showGrafic('Válvula', valve.id);
        let infowindow = new google.maps.InfoWindow({ content: contentString });
        marker.addListener("click", () => {
            if (currentInfowindow) {
                currentInfowindow.close();
            }

            infowindow.open(myMapCondition, marker);
            currentInfowindow = infowindow;
        });

        // Ocultar la línea de la válvula
        const polyline = new google.maps.Polyline({
            path: valveCoords,
            geodesic: true,
            strokeColor: "transparent", // Línea transparente
            strokeOpacity: 0, // Opacidad 0 para que sea transparente
            strokeWeight: 0 // Grosor 0 para que no sea visible
        });
        valveArray.push(marker);
        infoWindowsValves[valve.id] = infowindow;


        // Agregar la polilínea y el marcador al mapa
        polyline.setMap(myMapCondition);
    });
    markerValve = new MarkerClusterer(myMapCondition, valveArray, {
        styles: [{
            height: 56,
            width: 56,
            textColor: 'white',
            textSize: 12,
            marginTop: 19,
            url: '/images/icons/group_valve_black.svg', // Asegúrate de que esta ruta es correcta
        }],
        gridSize: 50,
        maxZoom: 16,
        title: 'valve'
    });
    google.maps.event.addListener(markerValve, 'clusteringend', function (valverer) {
        valvesMarkers = valverer.getClusters();
    });
}

// Función para ocultar las válvulas y grupos de válvulas del mapa
function clear_valves() {
    valveArray.forEach(marker => {

        if (typeof marker.setVisible === 'function') {
            marker.setVisible(false);
            marker.setIcon({
                url: '/images/icons/marker_valve.svg', // URL del nuevo icono
            });
        } else {
            console.error('El objeto marker no tiene el método setVisible:', marker);
        }
    });
    // Ocultar todos los marcadores dentro de los clusters
    markerValve.getMarkers().forEach(marker => {
        if (marker instanceof google.maps.Marker) {
            marker.setVisible(false);
        }
    });
    markerValve.clearMarkers();
}

// Función para mostrar las válvulas y grupos de válvulas del mapa
function show_valves() {
    valveArray.forEach(marker => {
        if (typeof marker.setVisible === 'function') {
            marker.setVisible(true);
        } else {
            console.error('El objeto marker no tiene el método setVisible:', marker);
        }
    });

    // Volver a agregar los marcadores al MarkerClusterer
    markerValve.addMarkers(valveArray);
}

// Función para colorear las válvulas del mapa
function activation_deactivation_valves_property(property) {
    let color
    let iconoPersonalizado
    valveArray.forEach(marker => {
        if (toggleValves) {
            dateExtractionMatiz.valvulasout.data.rows.forEach(valves => {
                if (marker.id === valves.id) {
                    if (property === 'estado') {
                        color = 'Operativa_' + valves[property];
                        marker.estado = valves[property];
                        iconoPersonalizado = {
                            url: `/images/icons/marker_valve_${color}.svg`,
                            // scaledSize: new google.maps.Size(8, 8)  // Tamaño del punto
                        };
                    } else {
                        color = getColorForCota(valves[property], property);
                        marker.cota = valves[property];
                        iconoPersonalizado = getIconMarkerValveColor(color);
                    }
                    contentString = showGrafic('Válvula', marker.id, property, valves[property]);
                }
            });
        } else {
            iconoPersonalizado = getIconMarkerValveColor('black');
            contentString = showGrafic('Válvula', marker.id);
        }
        marker.setIcon(iconoPersonalizado);

        // Actualizar el contenido de la InfoWindow
        let infowindow = infoWindowsValves[marker.id];

        if (infowindow) {
            infowindow.setContent(contentString);
        } else {
            infowindow = new google.maps.InfoWindow({
                content: contentString,
            });
            infoWindowsValves[marker.id] = infowindow; // Guardar la nueva InfoWindow en el array
        }

        if (infowindow && toggleValves) {
            google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                document.querySelectorAll('.button_historical').forEach(button => {
                    button.addEventListener('click', function () {
                        historicalExtraction('valvulasout', marker.id, 'toggleValves');
                    });
                });
            });
        }
    });
}

// Fin funciones de válvulas

// Inicio funciones de parcelas

function paint_plots() {
    const DemandPlots = getAllDemandPlots;
    // Iterar sobre las parcelas
    DemandPlots.forEach(function (plot) {
        var coordinates = plot.geometrygood;
        var plotCoords = []; // Array para almacenar las coordenadas de los puntos de la parcela

        // Obtener las coordenadas de los puntos de la parcela y agregarlas al array plotCoords
        coordinates.forEach(function (coord) {
            // Convertir las coordenadas a números
            var lat = parseFloat(coord.y);
            var lng = parseFloat(coord.x);

            // Verificar si las coordenadas son números válidos
            if (!isNaN(lat) && !isNaN(lng)) {
                plotCoords.push({
                    lat: lat,
                    lng: lng
                });
            } else {
                console.error("Coordenadas inválidas:", coord);
            }
        });
        if (plot && plot.gemelo) { // Verificar si la parcela tiene un 'gemelo' definido
            var polygon = new google.maps.Polygon({
                id: plot.refcat,
                refcat: plot.refcat,
                gemelo: plot.gemelo,
                paths: plotCoords,
                strokeColor: "#545454", // Color del borde del área
                strokeOpacity: 0.4, // Opacidad del borde del área
                strokeWeight: 1, // Grosor del borde del área
                fillColor: "#545454", // Color de relleno del área
                fillOpacity: 0.25, // Opacidad del relleno del área
            });

            // Agregar el área poligonal al mapa
            // Verificar si el polígono tiene el formato correcto antes de agregarlo al mapa
            if (typeof polygon.setMap === 'function') {
                // Agregar el área poligonal al mapa
                polygon.setMap(myMapCondition);
                plotsArray.push(polygon); // Almacenar el polígono en la variable global

                // Agregar evento de clic para mostrar la infowindow
                polygon.addListener('click', function () {
                    showPlotInfoWindow(plot);
                });

                // Agregar evento de mouseover para resaltar el nodo correspondiente
                polygon.addListener("mouseover", function () {
                    highlightNode(plot.gemelo);
                });

                // Agregar evento de mouseout para revertir el resaltado del nodo
                polygon.addListener("mouseout", function () {
                    resetNodeHighlight(plot.gemelo);
                });
            } else {
                console.error("El polígono no tiene el formato correcto y no puede ser pintado en el mapa: ", plot.refcat); // Ajustar el nombre del campo de referencia
            }
        }
    });
}

// Función para ocultar las parcelas del mapa
function clear_plots() {
    plotsArray.forEach(polygon => {

        if (typeof polygon.setVisible === 'function') {
            polygon.setVisible(false);
        } else {
            console.error('El objeto polygon no tiene el método setVisible:', polygon);
        }
    });
}

// Función para mostrar las parcelas del mapa
function show_plots() {
    plotsArray.forEach(polygon => {
        if (typeof polygon.setVisible === 'function') {
            polygon.setVisible(true);
        } else {
            console.error('El objeto polygon no tiene el método setVisible:', polygon);
        }
    });
}

// Función para colorear las parcelas del mapa
async function activation_deactivation_plots_property(property) {
    // Indexar parcelas por refcat
    dateExtractionMatiz.parcelasout.data.rows.forEach(row => {
        dataShowAffectedPlotsIndexadaCondition[row.id] = row;
    });

    let color, opacity;

    for (const polygon of plotsArray) {
        const plots = dataShowAffectedPlotsIndexadaCondition[polygon.id];
        if (!plots) continue; // Saltar si no hay datos para esta parcela

        if (togglePlots) {
            color = getColorForCota(plots[property], property);
            opacity = 0.6;
            polygon.cota = plots[property];
        } else {
            color = '#545454';
            opacity = 0.25;
            polygon.cota = null;
        }

        polygon.setOptions({
            strokeColor: "#545454",
            strokeOpacity: 0.4,
            strokeWeight: 1,
            fillColor: color,
            fillOpacity: opacity,
        });

        // Actualizar InfoWindow si ya estaba abierto
        const infowindow = infoWindowsPlots[polygon.id];
        if (infowindow && currentInfowindow === infowindow) {
            const contentString = togglePlots
                ? showGrafic('Parcela', null, property, plots[property], polygon.id)
                : showGrafic('Parcela', null, '', false, polygon.id);

            infowindow.setContent(contentString);
            infowindow.setPosition(polygon.getBounds().getCenter());
            infowindow.open(myMapCondition);
            currentInfowindow = infowindow;

            if (togglePlots) {
                google.maps.event.addListenerOnce(infowindow, 'domready', function () {
                    document.querySelectorAll('.button_historical').forEach(button => {
                        button.addEventListener('click', function () {
                            historicalExtraction('parcelasout', polygon.id, 'togglePlots');
                        });
                    });
                });
            }
        }
    }
}

function showPlotInfoWindow(plot, propertyName, propertyValue) {
    if (!plot || !plot.geometrygood || plot.geometrygood.length === 0) return;

    // Calcular centroide de la parcela (polígono)
    const bounds = new google.maps.LatLngBounds();
    plot.geometrygood.forEach(coord => {
        bounds.extend(new google.maps.LatLng(coord.y, coord.x));
    });
    const center = bounds.getCenter();

    let contentString;
    if (togglePlots && propertyName && propertyValue !== undefined) {
        contentString = showGrafic('Parcela', null, propertyName, propertyValue, plot.refcat);
    } else {
        contentString = showGrafic('Parcela', null, '', false, plot.refcat);
    }

    let infowindow = infoWindowsPlots[plot.refcat];
    if (infowindow) {
        infowindow.setContent(contentString);
        infowindow.setPosition(center);
    } else {
        infowindow = new google.maps.InfoWindow({
            content: contentString,
            position: center
        });
        infoWindowsPlots[plot.refcat] = infowindow;
    }

    if (currentInfowindow) {
        currentInfowindow.close();
    }

    infowindow.open(myMapCondition);
    currentInfowindow = infowindow;

    myMapCondition.setCenter(center);
    myMapCondition.setZoom(20);

    if (togglePlots) {
        google.maps.event.addListenerOnce(infowindow, 'domready', function () {
            document.querySelectorAll('.button_historical').forEach(button => {
                button.addEventListener('click', function () {
                    historicalExtraction('parcelasout', plot.refcat, 'togglePlots');
                });
            });
        });
    }
}

function highlightNode(gemelo) {
    // Buscar nodos correspondientes al 'gemelo'
    nodeNetworkArray.forEach(function (marker) {
        if (marker.title === gemelo.toString()) {
            if (marker) {
                // Cambiar el color del marcador a rojo
                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'red', // Cambiar a rojo
                    fillOpacity: 1,
                    scale: 7, // Aumentar la escala
                    strokeWeight: 0, // Sin borde
                    // Agregar sombra
                    shadow: {
                        anchor: { x: 0, y: 0 },
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: 'black', // Color de la sombra
                        fillOpacity: 0.5,
                        scale: 1.3, // Aumentar la escala de la sombra
                        strokeWeight: 0, // Sin borde
                    }
                });
                if (Array.isArray(clustersMarkers)) {
                    // Mapear el array clustersMarkers y filtrar los elementos 
                    const filteredClusters = clustersMarkers.filter(cluster => cluster.markers_ && Array.isArray(cluster.markers_) && cluster.markers_.length > 1);
                    if (filteredClusters.length > 0) {
                        filteredClusters.forEach(function (clusterMarkers, index) {
                            clusterMarkers.markers_.forEach(function (Marker) {
                                if (Marker.title === gemelo.toString() && clusterMarkers.markers_.length > 1) {
                                    // Seleccionar todos los elementos <div> con title='node'
                                    var clusterDiv = document.querySelectorAll('div[title="node"]');
                                    // Verificar si se encontró un div con el title 'node'
                                    if (index !== 0) {
                                        if (clusterDiv[index]) {
                                            var img = clusterDiv[index].querySelector('img');

                                            // Verificar si se encontró la etiqueta img
                                            if (img) {
                                                // Cambiar el src de la etiqueta img
                                                img.src = getGoogleClusterInlineSvg('red');
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                }
            }
        }
    });
}

function resetNodeHighlight(gemelo) {
    // Buscar nodos correspondientes al 'gemelo'
    nodeNetworkArray.forEach(function (marker) {
        if (marker.title === gemelo.toString()) {
            if (marker) {
                if (!toggleNodes) {
                    var color = 'black';
                } else {
                    var color = getColorForCota(marker.cota, marker.property);
                }
                // Cambiar el color del marcador a rojo
                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: color, // Color del punto negro
                    fillOpacity: 1,
                    scale: 4, // Restablecer la escala
                    strokeWeight: 0, // Sin borde
                });
                if (Array.isArray(clustersMarkers)) {
                    // Mapear el array clustersMarkers y filtrar los elementos 
                    const filteredClusters = clustersMarkers.filter(cluster => cluster.markers_ && Array.isArray(cluster.markers_) && cluster.markers_.length > 1);
                    if (filteredClusters.length > 0) {
                        filteredClusters.forEach(function (clusterMarkers, index) {
                            clusterMarkers.markers_.forEach(function (Marker) {
                                if (Marker.title === gemelo.toString()) {
                                    // Seleccionar todos los elementos <div> con title='node'
                                    var clusterDiv = document.querySelectorAll('div[title="node"]');
                                    // Verificar si se encontró un div con el title 'node'
                                    if (index !== 0) {
                                        if (clusterDiv[index]) {
                                            var img = clusterDiv[index].querySelector('img');
                                            // Verificar si se encontró la etiqueta img
                                            if (img) {
                                                // Cambiar el src de la etiqueta img
                                                img.src = getGoogleClusterInlineSvg('#999');
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                }
            }
        }
    });
}

// Fin funciones de parcelas

/* sección [Mapa de Google] llamada a iniciar mapa de google */
loadGoogleMapsScript()
    .then(() => initializeMap())
    .catch((err) => console.error("Failed to load Google Maps API:", err));
/* [Fin de sección] */


async function createLegend() {
    //var loadingTitle = document.getElementById('loading_title');
    //loadingTitle.innerHTML = 'Generando leyenda...';
    const legendHTML = `
        <div class="container_label_tank container_label_legend">
            <label class="label_tank label_legend">
                <input type="checkbox" id="toggle-tank" checked>Depósito
            </label>
            <span>
                <img src="/images/icons/icon-filter-values.svg" title="Filtrar nodos" style="height: 13px; cursor: pointer; display: none;">
                <i id="fas-legend-tank" class="fas_legend fas fa-trash" title="Limpia selección"></i>
            </span>
        </div>
            <label class="label_energy sublabel_legend">
                <input type="radio" name="toggle-group-tank" id="toggle-tank-energy" class="radio_layers">Energía (m.c.a.)
            </label>
            <label class="label_pressure sublabel_legend">
                <input type="radio" name="toggle-group-tank" id="toggle-tank-pressure" class="radio_layers">Presión (m.c.a.)
            </label>
            <label class="label_consumption sublabel_legend">
                <input type="radio" name="toggle-group-tank" id="toggle-tank-consumption" class="radio_layers">Consumo (L/s)
            </label>
            <label class="label_age-water sublabel_legend">
                <input type="radio" name="toggle-group-tank" id="toggle-tank-age-water" class="radio_layers">Edad del Agua (h)
            </label>
        <br>

        <div class="container_label_node container_label_legend">
            <label class="label_nodes label_legend">
                <input type="checkbox" id="toggle-nodes" checked>Nodos
            </label>
            <span>
                <img src="/images/icons/icon-filter-values.svg" title="Filtrar nodos" style="height: 13px; cursor: pointer; display: none;">
                <i id="fas-legend-nodes" class="fas_legend fas fa-trash" title="Limpia selección"></i>
            </span>
        </div>
            <label class="label_arrow_flow sublabel_legend">
                <input type="checkbox" id="toggle-nodes-purges">Purgas <img src="/images/icons/icon-purge-node.svg" style="height: 16px;">
            </label>
            <label class="label_energy sublabel_legend">
                <input type="radio" name="toggle-group-nodes" id="toggle-nodes-energy" class="radio_layers">Energía (m.c.a.)
            </label>
            <label class="label_pressure sublabel_legend">
                <input type="radio" name="toggle-group-nodes" id="toggle-nodes-pressure" class="radio_layers">Presión (m.c.a.)
            </label>
            <label class="label_age-water sublabel_legend">
                <input type="radio" name="toggle-group-nodes" id="toggle-nodes-age-water" class="radio_layers">Edad del Agua (h)
            </label>
        <br>    

        <div class="container_label_conduction container_label_legend">
            <label class="label_conductions label_legend">
                <input type="checkbox" id="toggle-conductions" checked>Conducciones
            </label>
            <span>
                <img src="/images/icons/icon-filter-values.svg" title="Filtrar conducciones" style="height: 13px; cursor: pointer; display: none;">
                <i id="fas-legend-conductions" class="fas_legend fas fa-trash" title="Limpia selección"></i>
            </span>
        </div>
            <label class="label_arrow_flow sublabel_legend">
                <input type="checkbox" id="toggle-conductions-arrow-flow">Dirección flujo <img src="/images/icons/icon-arrow-flow.png" title="Dirección del Flujo" style="height: 13px;">
            </label>
            <label class="label_flow sublabel_legend">
                <input type="radio" name="toggle-group-conductions" id="toggle-conductions-flow" class="radio_layers">Caudal (L/s)
            </label>
            <label class="label_speed sublabel_legend">
                <input type="radio" name="toggle-group-conductions" id="toggle-conductions-speed" class="radio_layers">Velocidad  (m/s)
            </label>
            <label class="label_age-water sublabel_legend">
                <input type="radio" name="toggle-group-conductions" id="toggle-conductions-age-water" class="radio_layers">Edad del Agua (h)
            </label>
        <br>

        <div class="container_label_valve container_label_legend">
            <label class="label_valves label_legend">
                <input type="checkbox" id="toggle-valves" checked>Válvulas
            </label>
            <span>
                <img src="/images/icons/icon-filter-values.svg" title="Filtrar válvulas" style="height: 13px; cursor: pointer; display: none;">
                <i id="fas-legend-valves" class="fas_legend fas fa-trash" title="Limpia selección"></i>
            </span>
        </div>
            <label class="label_position sublabel_legend">
                <input type="radio" name="toggle-group-valves" id="toggle-valves-position" class="radio_layers">Posición
            </label>
            <label class="label_flow sublabel_legend">
                <input type="radio" name="toggle-group-valves" id="toggle-valves-flow" class="radio_layers">Caudal (L/s)
            </label>
            <label class="label_speed sublabel_legend">
                <input type="radio" name="toggle-group-valves" id="toggle-valves-speed" class="radio_layers">Velocidad (m/s)
            </label>
            <label class="label_age-water sublabel_legend">
                <input type="radio" name="toggle-group-valves" id="toggle-valves-age-water" class="radio_layers">Edad del Agua (h)
            </label>
        <br>

        <div class="container_label_plot container_label_legend">
            <label class="label_plots label_legend">
                <input type="checkbox" id="toggle-plots" checked>Parcelas
            </label>
            <span>
                <img src="/images/icons/icon-filter-values.svg" title="Filtrar parcelas" style="height: 13px; cursor: pointer; display: none;">
                <i id="fas-legend-plots" class="fas_legend fas fa-trash" title="Limpia selección"></i>
            </span>
        </div>
            <label class="label_energy sublabel_legend">
                <input type="radio" name="toggle-group-plots" id="toggle-plots-energy" class="radio_layers">Energía (m.c.a.)
            </label>
            <label class="label_pressure sublabel_legend">
                <input type="radio" name="toggle-group-plots" id="toggle-plots-pressure" class="radio_layers">Presión (m.c.a.)
            </label>
            <label class="label_consumption sublabel_legend">
                <input type="radio" name="toggle-group-plots" id="toggle-plots-consumption" class="radio_layers">Consumo (L/s)
            </label>
            <label class="label_age-water sublabel_legend">
                <input type="radio" name="toggle-group-plots" id="toggle-plots-age-water" class="radio_layers">Edad del Agua (h)
            </label>
        `;
    const legendContainer = document.getElementById("layer-tab");
    // Insertar el HTML en el contenedor de la leyenda
    legendContainer.innerHTML = legendHTML;

    const tankCheckbox = legendContainer.querySelector('#toggle-tank');
    const tankFas = legendContainer.querySelector('#fas-legend-tank');
    const tankRarioEnergy = legendContainer.querySelector('#toggle-tank-energy');
    const tankRarioPressure = legendContainer.querySelector('#toggle-tank-pressure');
    const tankRarioConsumption = legendContainer.querySelector('#toggle-tank-consumption');
    const tankRarioAageWater = legendContainer.querySelector('#toggle-tank-age-water');
    const tankRadios = legendContainer.querySelectorAll('input[name="toggle-group-tank"]');
    tankCheckbox.addEventListener('change', function () {
        if (dateExtraction) {
            tankRadios.forEach(radio => {
                if (!this.checked) {
                    radio.checked = false; // Desmarcar el radio button
                }
                radio.disabled = !this.checked;
            });
        }
        if (this.checked) {
            paint_tanks(); // Pintar el tanque si no existe
        } else {
            clear_paint_tanks()
            closeCurrentInfoWindowIfFromLayer();
        }
    });

    //Elimina la opción seleccionada
    tankFas.addEventListener('click', function () {
        tankRadios.forEach(radio => {
            if (!this.checked) {
                radio.checked = false; // Desmarcar el radio button
            }
        });
        clear_paint_tanks();
        toggleTanks = false;
        paint_tanks();
    });


    //Control de cambios de los radio button de Depósito.

    tankRarioEnergy.addEventListener('change', async function () {
        loading_start();
        toggleTanks = 'energia';
        clear_paint_tanks();
        dateExtractionRangesMatiz['energia'] = getMinMaxFromMatiz('energia', dateExtractionMatiz);

        await create_legend(dateExtractionRangesMatiz, 'energia', 'Energía Depósito [m.c.a.]');
        await paint_tanks('energia');
        //loading_end();
    });

    tankRarioPressure.addEventListener('change', async function () {
        loading_start();
        toggleTanks = 'presion';
        clear_paint_tanks();
        dateExtractionRangesMatiz['presion'] = getMinMaxFromMatiz('presion', dateExtractionMatiz);
        await create_legend(dateExtractionRangesMatiz, 'presion', 'Presión Depósito [m.c.a.]');
        await paint_tanks('presion');
        //loading_end();
    });

    tankRarioConsumption.addEventListener('change', async function () {
        loading_start();
        toggleTanks = 'consumo';
        clear_paint_tanks();
        dateExtractionRangesMatiz['consumo'] = getMinMaxFromMatiz('consumo', dateExtractionMatiz);
        await create_legend(dateExtractionRangesMatiz, 'consumo', 'Consumo Depósito [L/s]');
        await paint_tanks('consumo');
        //loading_end();
    });

    tankRarioAageWater.addEventListener('change', async function () {
        loading_start();
        toggleTanks = 'edad';
        clear_paint_tanks();
        dateExtractionRangesMatiz['edad'] = getMinMaxFromMatiz('edad', dateExtractionMatiz);
        await create_legend(dateExtractionRangesMatiz, 'edad', 'Edad Depósito [h]');
        await paint_tanks('edad');
        //loading_end();
    });


    const nodesCheckbox = legendContainer.querySelector('#toggle-nodes');
    const nodesFas = legendContainer.querySelector('#fas-legend-nodes');
    const nodesPurgesCheckbox = legendContainer.querySelector('#toggle-nodes-purges');
    const nodesRarioEnergy = legendContainer.querySelector('#toggle-nodes-energy');
    const nodesRarioPressure = legendContainer.querySelector('#toggle-nodes-pressure');
    const nodesRarioAageWater = legendContainer.querySelector('#toggle-nodes-age-water');
    const nodesRadios = legendContainer.querySelectorAll('input[name="toggle-group-nodes"]');

    nodesCheckbox.addEventListener('change', async function () {
        await loading_start();
        setTimeout(() => {
            if (dateExtraction) {
                toggleNodes = false;
                nodesRadios.forEach(radio => {
                    if (!this.checked) {
                        radio.checked = false; // Desmarcar el radio button
                    }
                    radio.disabled = !this.checked;
                });
                nodesPurgesCheckbox.checked = false;
                nodesPurgesCheckbox.disabled = !this.checked;
            }
            if (this.checked) {
                show_nodes_network();
            } else {
                clear_nodes_network();
                deletePurges();
                closeCurrentInfoWindowIfFromLayer();

                nodeNetworkArray.forEach(marker => {
                    marker.property = null;
                    marker.cota = null;
                    marker.color = null;
                });
            }
        }, 500);
        //loading_end();
    });

    //Elimina la opción seleccionada
    nodesFas.addEventListener('click', async function () {
        await loading_start();
        setTimeout(() => {
            nodesRadios.forEach(radio => {
                if (!this.checked) {
                    radio.checked = false; // Desmarcar el radio button
                }
            });
            show_nodes_network();
            toggleNodes = false;
            activation_deactivation_node_property(toggleNodes);
            nodesPurgesCheckbox.checked = false;
            deletePurges();
        }, 500);
        //loading_end();
    });

    nodesPurgesCheckbox.addEventListener('change', async function () {
        await loading_start();
        setTimeout(() => {
            if (this.checked) {
                purgesExtraction();
            } else {
                deletePurges();
            }
        }, 500);
        //loading_end();
    });

    //Control de cambios de los radio button de Nodos.

    nodesRarioEnergy.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            toggleNodes = 'energia';
            dateExtractionRangesMatiz['energia'] = getMinMaxFromMatiz('energia', dateExtractionMatiz);
            await create_legend(dateExtractionRangesMatiz, 'energia', 'Energía Nodo [m.c.a.]');
            activation_deactivation_node_property('energia');
        }, 500);
        //loading_end();
    });

    nodesRarioPressure.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            toggleNodes = 'presion';
            dateExtractionRangesMatiz['presion'] = getMinMaxFromMatiz('presion', dateExtractionMatiz);
            await create_legend(dateExtractionRangesMatiz, 'presion', 'Presión Nodo [m.c.a.]');
            activation_deactivation_node_property('presion');
        }, 500);
        //loading_end();
    });

    nodesRarioAageWater.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            toggleNodes = 'edad';
            dateExtractionRangesMatiz['edad'] = getMinMaxFromMatiz('edad', dateExtractionMatiz);
            await create_legend(dateExtractionRangesMatiz, 'edad', 'Edad Nodo [h]');
            activation_deactivation_node_property('edad');
        }, 500);
        //loading_end();
    });

    // Agregar evento al checkbox de conducciones
    const conductionsCheckbox = legendContainer.querySelector('#toggle-conductions');
    const conductionsFas = legendContainer.querySelector('#fas-legend-conductions');
    const conductionsArrowFlowCheckbox = legendContainer.querySelector('#toggle-conductions-arrow-flow');
    const conductionsRarioFlow = legendContainer.querySelector('#toggle-conductions-flow');
    const conductionsRarioSpeed = legendContainer.querySelector('#toggle-conductions-speed');
    const conductionsRarioAgeWater = legendContainer.querySelector('#toggle-conductions-age-water');
    const conductionRadios = legendContainer.querySelectorAll('input[name="toggle-group-conductions"]');

    conductionsCheckbox.addEventListener('change', async function () {
        await loading_start();
        setTimeout(() => {
            toggleConductions = false;
            if (dateExtraction) {
                conductionRadios.forEach(radio => {
                    if (!this.checked) {
                        radio.checked = false; // Desmarcar el radio button
                    }
                    radio.disabled = !this.checked;
                });
                conductionsArrowFlowCheckbox.checked = false;
                conductionsArrowFlowCheckbox.disabled = !this.checked;
            }
            if (this.checked) {
                show_traffic_conductions();
            } else {
                clear_conductions();
                deleteArrowFlow();
                closeCurrentInfoWindowIfFromLayer();

                trafficConductionsArray.forEach(polyline => {
                    polyline.property = null;
                    polyline.cota = null;
                    polyline.color = null;
                });
            }
        }, 500);
        //loading_end();
    });

    //Elimina la opción seleccionada
    conductionsFas.addEventListener('click', async function () {
        await loading_start();
        setTimeout(() => {
            conductionRadios.forEach(radio => {
                if (!this.checked) {
                    radio.checked = false; // Desmarcar el radio button
                }
            });
            show_traffic_conductions();
            toggleConductions = false;
            activation_deactivation_conductions_property(toggleConductions);
        }, 500);
        //loading_end();
    });

    // Inicialmente deshabilitar los radio buttons si el checkbox de conducciones está desactivado
    conductionRadios.forEach(radio => {
        radio.disabled = !conductionsCheckbox.checked;
    });

    //Control de cambios delos checkbox de la dirección del flujo de Conducciones

    conductionsArrowFlowCheckbox.addEventListener('change', async function () {
        await loading_start();
        setTimeout(() => {
            if (this.checked) {
                drawArrowFlow();
            } else {
                deleteArrowFlow();
            }
        }, 500);
        //loading_end();
    });

    //Control de cambios de los radio button de Conducciones

    conductionsRarioFlow.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            toggleConductions = 'caudal';
            dateExtractionRangesMatiz['caudal'] = getMinMaxFromMatiz('caudal', dateExtractionMatiz);
            if (Math.abs(dateExtractionRangesMatiz['caudal'].min) > Math.abs(dateExtractionRangesMatiz['caudal'].max)) {
                dateExtractionRangesMatiz['caudal'].max = Math.abs(dateExtractionRangesMatiz['caudal'].min);
                dateExtractionRangesMatiz['caudal'].min = 0;
            } else {
                dateExtractionRangesMatiz['caudal'].max = Math.abs(dateExtractionRangesMatiz['caudal'].max);
                dateExtractionRangesMatiz['caudal'].min = 0;
            }
            await create_legend(dateExtractionRangesMatiz, 'caudal', 'Caudal Conducción [L/s]');
            activation_deactivation_conductions_property('caudal');
        }, 500);
        //loading_end();
    });
    conductionsRarioSpeed.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            toggleConductions = 'velocidad';
            dateExtractionRangesMatiz['velocidad'] = getMinMaxFromMatiz('velocidad', dateExtractionMatiz);
            await create_legend(dateExtractionRangesMatiz, 'velocidad', 'Velocidad Conducción [m/s]');

            activation_deactivation_conductions_property('velocidad');
        }, 500);
        //loading_end();
    });
    conductionsRarioAgeWater.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            toggleConductions = 'edad';
            dateExtractionRangesMatiz['edad'] = getMinMaxFromMatiz('edad', dateExtractionMatiz);
            await create_legend(dateExtractionRangesMatiz, 'edad', 'Edad Conducción [h]');
            activation_deactivation_conductions_property('edad');
        }, 500);
        //loading_end();
    });

    // Agregar evento al checkbox de válvulas
    const valvesCheckbox = legendContainer.querySelector('#toggle-valves');
    const valvesFas = legendContainer.querySelector('#fas-legend-valves');
    const valvesRarioPosition = legendContainer.querySelector('#toggle-valves-position');
    const valvesRarioFlow = legendContainer.querySelector('#toggle-valves-flow');
    const valvesRarioSpeed = legendContainer.querySelector('#toggle-valves-speed');
    const valvesRarioAgeWater = legendContainer.querySelector('#toggle-valves-age-water');
    const valveRadios = legendContainer.querySelectorAll('input[name="toggle-group-valves"]');

    valvesCheckbox.addEventListener('change', async function () {
        await loading_start();
        setTimeout(() => {
            if (dateExtraction) {
                valveRadios.forEach(radio => {
                    if (!this.checked) {
                        radio.checked = false; // Desmarcar el radio button
                    }
                    radio.disabled = !this.checked;
                });
            }
            if (this.checked) {
                show_valves();
                toggleValves = false;
                activation_deactivation_valves_property(toggleValves);
            } else {
                clear_valves();
                closeCurrentInfoWindowIfFromLayer();
            }
        }, 500);
        //loading_end();
    });

    //Elimina la opción seleccionada
    valvesFas.addEventListener('click', async function () {
        await loading_start();
        setTimeout(() => {
            valveRadios.forEach(radio => {
                if (!this.checked) {
                    radio.checked = false; // Desmarcar el radio button
                }
            });
            show_valves();
            toggleValves = false;
            activation_deactivation_valves_property(toggleValves);
        }, 500);
        //loading_end();
    });

    // Inicialmente deshabilitar los radio buttons si el checkbox de válvulas está desactivado
    valveRadios.forEach(radio => {
        radio.disabled = !valvesCheckbox.checked;
    });

    //Control de cambios de los radio button de Vávulas

    valvesRarioPosition.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['estado'] = getMinMaxFromMatiz('estado', dateExtractionMatiz);
            toggleValves = 'estado';
            await create_legend(dateExtractionRangesMatiz, 'estado', 'Estado Válvula');
            activation_deactivation_valves_property('estado');
        }, 500);
        //loading_end();
    });
    valvesRarioFlow.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['caudal'] = getMinMaxFromMatiz('caudal', dateExtractionMatiz);
            toggleValves = 'caudal';
            await create_legend(dateExtractionRangesMatiz, 'caudal', 'Caudal Válvula [L/s]');
            activation_deactivation_valves_property('caudal');
        }, 500);
        //loading_end();
    });
    valvesRarioSpeed.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['velocidad'] = getMinMaxFromMatiz('velocidad', dateExtractionMatiz);
            toggleValves = 'velocidad';
            await create_legend(dateExtractionRangesMatiz, 'velocidad', 'Velocidad Válvula [m/s]');
            activation_deactivation_valves_property('velocidad');
        }, 500);
        //loading_end();
    });
    valvesRarioAgeWater.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['edad'] = getMinMaxFromMatiz('edad', dateExtractionMatiz);
            toggleValves = 'edad';
            await create_legend(dateExtractionRangesMatiz, 'edad', 'Edad Válvula [h]');
            activation_deactivation_valves_property('edad');
        }, 500);
        //loading_end();
    });


    // Agregar evento al checkbox de parcelas
    const plotsCheckbox = legendContainer.querySelector('#toggle-plots');
    const plotsFas = legendContainer.querySelector('#fas-legend-plots');
    const plotsRarioEnergy = legendContainer.querySelector('#toggle-plots-energy');
    const plotsRarioPressure = legendContainer.querySelector('#toggle-plots-pressure');
    const plotsRarioConsumption = legendContainer.querySelector('#toggle-plots-consumption');
    const plotsRarioAgeWater = legendContainer.querySelector('#toggle-plots-age-water');
    const plotRadios = legendContainer.querySelectorAll('input[name="toggle-group-plots"]');

    plotsCheckbox.addEventListener('change', async function () {
        await loading_start();
        setTimeout(() => {
            if (dateExtraction) {
                plotRadios.forEach(radio => {
                    if (!this.checked) {
                        radio.checked = false; // Desmarcar el radio button
                    }
                    radio.disabled = !this.checked;
                });
                if (this.checked) {
                    show_plots();
                    togglePlots = false;
                    activation_deactivation_plots_property(togglePlots);
                } else {
                    clear_plots();
                    closeCurrentInfoWindowIfFromLayer();
                }
            }
        }, 500);
        //loading_end();
    });

    //Elimina la opción seleccionada
    plotsFas.addEventListener('click', async function () {
        await loading_start();
        setTimeout(() => {
            plotRadios.forEach(radio => {
                if (!this.checked) {
                    radio.checked = false; // Desmarcar el radio button
                }
            });
            show_plots();
            togglePlots = false;
            activation_deactivation_plots_property(togglePlots);
        }, 500);
        //loading_end();
    });

    //Control de cambios de los radio button de Vávulas

    plotsRarioEnergy.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['energia'] = getMinMaxFromMatiz('energia', dateExtractionMatiz);
            togglePlots = 'energia';
            await create_legend(dateExtractionRangesMatiz, 'energia', 'Energía Parcela [m.c.a.]');

            activation_deactivation_plots_property('energia');
        }, 500);
        //loading_end();
    });
    plotsRarioPressure.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['presion'] = getMinMaxFromMatiz('presion', dateExtractionMatiz);
            togglePlots = 'presion';
            await create_legend(dateExtractionRangesMatiz, 'presion', 'Presión Parcela [m.c.a.]');
            activation_deactivation_plots_property('presion');
        }, 500);
        //loading_end();
    });
    plotsRarioConsumption.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['consumo'] = getMinMaxFromMatiz('consumo', dateExtractionMatiz);
            togglePlots = 'consumo';
            await create_legend(dateExtractionRangesMatiz, 'consumo', 'Consumo Parcela [L/s]');
            activation_deactivation_plots_property('consumo');
        }, 500);
        //loading_end();
    });
    plotsRarioAgeWater.addEventListener('change', async function () {
        await loading_start();
        setTimeout(async () => {
            dateExtractionRangesMatiz['edad'] = getMinMaxFromMatiz('edad', dateExtractionMatiz);
            togglePlots = 'edad';
            await create_legend(dateExtractionRangesMatiz, 'edad', 'Edad Parcela [h]');
            activation_deactivation_plots_property('edad');
        }, 500);
        //loading_end();
    });

    const availableInformationLabel = document.createElement('div');
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
    myMapCondition.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(availableInformationLabel);


    const container = document.createElement('div');

    container.id = 'datetime-picker-container';

    const datetimePicker = document.createElement('input');
    datetimePicker.id = 'datetime-picker';
    datetimePicker.type = 'datetime-local';

    // Obtener la fecha y hora actual
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));

    // Restar un día (24 horas * 60 minutos * 60 segundos * 1000 milisegundos)
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const yesterday = new Date(localDate.getTime() - oneDayInMilliseconds);

    // Configurar la fecha y hora mínima (30 días antes)
    // Ajustar la fecha de ayer a la zona horaria local
    const localYesterday = new Date(yesterday.getTime() - (offset * 60 * 1000));

    // Obtener la fecha 30 días atrás
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Ajustar la fecha de 30 días atrás a la zona horaria local
    const localThirtyDaysAgo = new Date(thirtyDaysAgo.getTime() - (offset * 60 * 1000));

    // Obtener las fechas en formato 'YYYY-MM-DDTHH:00' (horas completas)
    const maxDateTime = localYesterday.toISOString().slice(0, 13) + ":00";
    const minDateTime = localThirtyDaysAgo.toISOString().slice(0, 13) + ":00";

    // Configurar el valor, máximo y mínimo del datetimePicker
    datetimePicker.value = maxDateTime;
    datetimePicker.max = maxDateTime;
    datetimePicker.min = minDateTime;

    container.appendChild(datetimePicker);
    // Añadir el contenedor a los controles del mapa
    myMapCondition.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(container);

    //await percentageExtraction(localYesterday.toISOString().slice(0, 11) + "00:00");
    //await dataExtraction(datetimePicker.value + ':00');

    // Función para actualizar el contenido del span
    function updateAvailableInformation() {
        const HTMLAvailableInformationContentSpanType = document.getElementById("HTML-available-information-content-span-type");
        if (HTMLAvailableInformationContentSpanType) {
            if (dateExtractionMatiz.certidumbre.data.rows.length > 0) {
                HTMLAvailableInformationContentSpanType.innerHTML = dateExtractionMatiz.certidumbre.data.rows[0].porcentaje_alcazar + '%';
                toggleRadioButtons(true)
            } else {
                HTMLAvailableInformationContentSpanType.innerHTML = '0%'
                toggleRadioButtons(false)
            }

        }
    }

    function toggleRadioButtons(enable) {
        dateExtraction = enable;
        // Obtener todos los elementos input de tipo radio
        const radioButtons = document.querySelectorAll('.radio_layers');

        clear_paint_tanks();
        toggleTanks = false;
        paint_tanks();

        // clear_nodes_network();

        // Recorrer los radio buttons y establecer la propiedad disabled
        radioButtons.forEach(radio => {
            radio.checked = false;
            radio.disabled = !enable;
        });
        nodesPurgesCheckbox.checked = false;
        nodesPurgesCheckbox.disabled = !enable;
        conductionsArrowFlowCheckbox.checked = false;
        conductionsArrowFlowCheckbox.disabled = !enable;
        ////loading_end();
    }

    // Observer para detectar la adición del span al DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const HTMLAvailableInformationContentSpanType = document.getElementById("HTML-available-information-content-span-type");
                if (HTMLAvailableInformationContentSpanType) {
                    //updateAvailableInformation();
                    observer.disconnect(); // Dejar de observar una vez que el elemento está en el DOM
                }
            }
        }
    });

    // Configuración del observer
    const config = { childList: true, subtree: true };

    // Iniciar la observación del cuerpo del documento
    observer.observe(document.body, config);

    // Llamar a la función inicial para asegurar que los datos se extraigan
    //updateAvailableInformation();

    // Asegurarse de que solo se seleccionen horas completas
    datetimePicker.addEventListener('change', async function () {
        await loading_start();
        setTimeout(() => {
            var loadingTitle = document.getElementById('loading_title');
            loadingTitle.innerHTML = 'Extrayendo datos...';
            const date = new Date(datetimePicker.value);
            date.setMinutes(0); // Ajustar los minutos a 00
            date.setSeconds(0); // Ajustar los segundos a 00 (opcional)
            date.setMilliseconds(0); // Ajustar los milisegundos a 00 (opcional)

            const adjustedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000));
            datetimePicker.value = adjustedDate.toISOString().slice(0, 16);

            percentageExtraction(adjustedDate.toISOString().slice(0, 11) + "00:00");
            dataExtraction(datetimePicker.value + ':00');
            //updateAvailableInformation();
            reset_properties();
        }, 500);
        //loading_end();
    });
    //loading_end();
}

// Inicio funciones comunes

function center_map() {
    const buttonCenterMap = document.createElement('div');
    buttonCenterMap.id = 'button-center-map';
    buttonCenterMap.className = 'button_center_map';
    buttonCenterMap.title = 'Centrar mapa';
    const HTMLbuttonCenterMap = `
            <div class="button_center_map_icon"><svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>
        `;

    buttonCenterMap.innerHTML = HTMLbuttonCenterMap;
    myMapCondition.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(buttonCenterMap);

    // Función para centrar el mapa en las coordenadas y zoom específicos
    function centerMapToCoordinates() {

        // Centrar el mapa en las coordenadas y establecer el zoom
        myMapCondition.setCenter({ lat: targetLatitude, lng: targetLongitude });
        myMapCondition.setZoom(targetZoom);
    }

    // Agregar evento de clic al botón para centrar el mapa
    buttonCenterMap.addEventListener('click', centerMapToCoordinates);
}

function reset_properties() {

    const conductionsArrowFlowCheckbox = document.getElementById("toggle-conductions-arrow-flow");
    deletePurges();
    deleteArrowFlow();
    if (toggleTanks) {
        clear_paint_tanks();
        toggleTanks = false;
        paint_tanks();
    }
    if (toggleNodes) {
        show_nodes_network();
        nodesPurgesCheckbox.checked = false;
        toggleNodes = false;
        activation_deactivation_node_property(toggleNodes);
    }
    if (toggleConductions) {
        show_traffic_conductions();
        conductionsArrowFlowCheckbox.checked = false;
        toggleConductions = false;
        activation_deactivation_conductions_property(toggleConductions);
    }
    if (toggleValves) {
        show_valves();
        toggleValves = false;
        activation_deactivation_valves_property(toggleValves);
    }
    if (togglePlots) {
        show_plots();
        togglePlots = false;
        activation_deactivation_plots_property(togglePlots);
    }
}

function showGrafic(type, id = null, nameValue = '', value = null, refcat = null) {
    let HTMLContent = `
        <div class='HTMLContent_container'>
            <div class='HTMLContent_container_type'>
                <label class='HTMLContent_label_type'>
                    <strong>Tipo</strong>:
                </label>
                <span class='HTMLContent_span_type'>
                    ${type}
                </span>
            </div>
    `;

    // Handle identifier display (id or refcat)
    if (type === 'Parcela' && refcat) {
        HTMLContent += `
            <div class='HTMLContent_container_id'>
                <label class='HTMLContent_label_id'>
                    <strong>Refcat</strong>:
                </label>
                <span class='HTMLContent_span_id'>
                    ${refcat}
                </span>
            </div>
        `;
    } else if (id) {
        // Handle id (simple value or object)
        const displayId = (typeof id === 'object' && id.id) ? id.id : id;
        HTMLContent += `
            <div class='HTMLContent_container_id'>
                <label class='HTMLContent_label_id'>
                    <strong>ID</strong>:
                </label>
                <span class='HTMLContent_span_id'>
                    ${displayId}
                </span>
            </div>
        `;
    }

    // Handle node-specific properties (caudal, property/cota)
    if (type === 'Nodo' && typeof id === 'object') {
        if (id.caudal) {
            HTMLContent += `
                <div class='HTMLContent_container_id'>
                    <label class='HTMLContent_label_id'>
                        <strong>Caudal Horario Equivalente de Purga</strong>:
                    </label><br>
                    <span class='HTMLContent_span_id'>
                        ${id.caudal.toFixed(4)} [L/s]
                    </span>
                </div>
            `;
        }
        if (id.property && id.cota !== undefined) {
            HTMLContent += `
                <div class='HTMLContent_container_id'>
                    <label class='HTMLContent_label_id'>
                    <strong>${capitalized_property(id.property)}</strong>:
                    </label>
                    <span class='HTMLContent_span_id'>
                        ${id.cota} ${property_units(id.property)}
                    </span>
                </div>
            `;
        }
    }

    // Handle general property value (for non-node types or when nameValue/value are provided)
    if ((value !== null || value === 0) && nameValue) {
        HTMLContent += `
            <div class='HTMLContent_container_id'>
                <label class='HTMLContent_label_id'>
                    <strong>
                    ${nameValue === 'estado' ? 'Posición' : capitalized_property(nameValue)}
                    </strong>:
                </label>
                <span class='HTMLContent_span_id'>
                    ${value} ${property_units(nameValue)}
                </span>
            </div>
        `;
    }

    // Add historical button if there's a value to show historical data for
    if ((value !== null || value === 0 || (type === 'Nodo' && id.property)) && nameValue) {
        HTMLContent += `
            <button class="button_historical">Histórico <i class="fas fa-table"></i></button>
        `;
    }

    HTMLContent += `
        </div>
    `;

    return HTMLContent;
}

function create_legend(valuesArray, nameProperty, nametitle) {
    const minValue = valuesArray[nameProperty].min;
    const maxValue = valuesArray[nameProperty].max;
    leftLegendHTML = `
            <div class="head_conductions_legend">
                <h3 class="title_conductions_legend">${nametitle}</h3>
            </div>
            <div class="body_conductions_legend">
        `;
    if (nameProperty == 'estado') {
        leftLegendHTML += `
                <div class="type_open_conductions_legend range_conductions_legend">
                    <div class="type_open_conductions_material_legend_icon" style="background-color: green;"></div>
                    <p>Abierta</p>
                </div>
                <div class="type_close_conductions_legend range_conductions_legend">
                    <div class="type_close_conductions_material_legend_icon" style="background-color: red;"></div>
                    <p>Cerrada</p>
                </div>
            `;
    } else {
        propertiesWithColors = getRangeValues(minValue, maxValue, nameProperty);
        for (let i = 0; i < propertiesWithColors.length; i++) {
            leftLegendHTML += `
                    <div class="type_${i + 1}_conductions_legend range_conductions_legend">
                        <div class="type_${i + 1}_conductions_material_legend_icon" style="background-color: ${propertiesWithColors[i].color};"></div>
                        `;
            if (nameProperty === 'consumo' && propertiesWithColors[i].min === 0 && propertiesWithColors[i].max === 0) {
                leftLegendHTML += `<p>= ${propertiesWithColors[i].min}</p>`;
            } else if (nameProperty === 'consumo' && propertiesWithColors[i - 1].min === 0 && propertiesWithColors[i - 1].max === 0) {
                leftLegendHTML += `<p>> ${propertiesWithColors[i].min} - < ${propertiesWithColors[i].max}</p>`;
            } else {
                if (propertiesWithColors[i].max === Infinity) {
                    leftLegendHTML += `<p>&ge; ${propertiesWithColors[i].min}</p>`;
                } else {
                    if (i === (propertiesWithColors.length - 1)) {
                        leftLegendHTML += `<p>&ge; ${propertiesWithColors[i].min} - &le; ${propertiesWithColors[i].max}</p>`;
                    } else {
                        leftLegendHTML += `<p>&ge; ${propertiesWithColors[i].min} - < ${propertiesWithColors[i].max}</p>`;
                    }
                }
            }
            leftLegendHTML += `
                    </div>
                `;
        }
    }
    leftLegendHTML += `
            </div>
        `;
}
function getRangeValues(minValues, maxValues, nameProperty) {
    // Definir colores para cada rango
    const colorsValues = ['blue', 'green', 'yellow', 'orange', 'maroon'];
    if (nameProperty === 'energia' || nameProperty === 'presion') {
        let matrix = [];
        if (nameProperty === 'energia') {
            matrix = matrix.concat(
                dateExtractionMatiz.depositosout.data.rows.map(row => row.energia)
            );
            matrix = matrix.concat(
                dateExtractionMatiz.nodosout.data.rows.map(row => row.energia)
            );
            matrix = matrix.concat(
                dateExtractionMatiz.parcelasout.data.rows.map(row => row.energia)
            );
        } else if (nameProperty === 'presion') {
            matrix = matrix.concat(
                dateExtractionMatiz.depositosout.data.rows.map(row => row.presion)
            );
            matrix = matrix.concat(
                dateExtractionMatiz.nodosout.data.rows.map(row => row.presion)
            );
            matrix = matrix.concat(
                dateExtractionMatiz.parcelasout.data.rows.map(row => row.presion)
            );
        }


        matrix.sort((a, b) => a - b);

        if (minValues < 0) { // Primer grupo hasta el cero y después cuantiles 4 grupos
            // Crear el primer grupo que cubra todos los valores negativos hasta 0
            const negativeValues = matrix.filter(value => value < 0);
            const positiveValues = matrix.filter(value => value >= 0);

            let rangesValues = [];

            // Añadir el primer grupo con todos los valores negativos hasta 0
            if (negativeValues.length > 0) {
                rangesValues.push({
                    min: parseFloat(negativeValues[0].toFixed(2)),
                    max: 0,
                    color: colorsValues[0]
                });
            }

            // Calcular los cuartiles restantes con los valores positivos
            const numberOfGroups = 4; // Ahora trabajamos con 4 grupos restantes
            const groupSize = Math.ceil(positiveValues.length / numberOfGroups);

            let previousMax = 0; // Inicializamos el máximo anterior en 0, para el primer grupo positivo

            for (let i = 0; i < numberOfGroups; i++) {
                const start = i * groupSize;
                const end = start + groupSize;
                const group = positiveValues.slice(start, end);

                const min = previousMax;
                const max = group[group.length - 1] || previousMax;

                // if (i === (numberOfGroups - 1)) {
                //     rangesValues.push({ min: parseFloat(min.toFixed(2)), max: Infinity, color: colorsValues[i + 1] });
                // } else {
                rangesValues.push({ min: parseFloat(min.toFixed(2)), max: parseFloat(max.toFixed(2)), color: colorsValues[i + 1] });
                // }

                previousMax = max; // Actualizamos el máximo anterior para el siguiente grupo
            }

            return rangesValues;

        } else { // Cuartiles de 5 grupos
            const numberOfGroups = 5;
            const groupSize = Math.ceil(matrix.length / numberOfGroups);
            let rangesValues = [];
            let previousMax = matrix[0] || 0; // Inicializamos el máximo anterior en el mínimo valor de la matriz

            for (let i = 0; i < numberOfGroups; i++) {
                const start = i * groupSize;
                const end = start + groupSize;
                const group = matrix.slice(start, end);

                const min = previousMax;
                const max = group[group.length - 1] || previousMax;

                // if (i === (numberOfGroups - 1)) {
                //     rangesValues.push({ min: parseFloat(min.toFixed(2)), max: Infinity, color: colorsValues[i] });
                // } else {
                rangesValues.push({ min: parseFloat(min.toFixed(2)), max: parseFloat(max.toFixed(2)), color: colorsValues[i] });
                // }

                previousMax = max; // Actualizamos el máximo anterior para el siguiente grupo
            }

            return rangesValues;
        }
    } else if (nameProperty === 'presion1') {
        if (minValues < 0) {
            // Dividir el máximo en 3 partes iguales
            const intervalValues = parseFloat((maxValues / 4).toFixed(2));
            const zeroValue = 0;
            return rangesValues = [
                { min: parseFloat(minValues.toFixed(2)), max: parseFloat(zeroValue.toFixed(2)), color: colorsValues[0] },
                { min: parseFloat(zeroValue.toFixed(2)), max: parseFloat((zeroValue + intervalValues).toFixed(2)), color: colorsValues[1] },
                { min: parseFloat((zeroValue + intervalValues).toFixed(2)), max: parseFloat((zeroValue + 2 * intervalValues).toFixed(2)), color: colorsValues[2] },
                { min: parseFloat((zeroValue + 2 * intervalValues).toFixed(2)), max: parseFloat((zeroValue + 3 * intervalValues).toFixed(2)), color: colorsValues[3] },
                { min: parseFloat((zeroValue + 3 * intervalValues).toFixed(2)), max: parseFloat(maxValues.toFixed(2)), color: colorsValues[4] },
            ];
        } else {
            // Calcular el rango total
            const rangeValues = maxValues - minValues;

            // Dividir el rango en 4 partes iguales
            const intervalValues = parseFloat((rangeValues / 6).toFixed(2));

            return rangesValues = [
                { min: parseFloat(minValues.toFixed(2)), max: parseFloat((minValues + intervalValues).toFixed(2)), color: colorsValues[0] },
                { min: parseFloat((minValues + intervalValues).toFixed(2)), max: parseFloat((minValues + 2 * intervalValues).toFixed(2)), color: colorsValues[1] },
                { min: parseFloat((minValues + 2 * intervalValues).toFixed(2)), max: parseFloat((minValues + 3 * intervalValues).toFixed(2)), color: colorsValues[2] },
                { min: parseFloat((minValues + 3 * intervalValues).toFixed(2)), max: parseFloat((minValues + 4 * intervalValues).toFixed(2)), color: colorsValues[3] },
                { min: parseFloat((minValues + 4 * intervalValues).toFixed(2)), max: parseFloat(maxValues.toFixed(2)), color: colorsValues[4] }
            ];
        }
    } else if (nameProperty === 'velocidad') {
        let matrix = [];
        matrix = matrix.concat(
            dateExtractionMatiz.conduccionesout.data.rows.map(row => row.velocidad)
        );
        matrix = matrix.concat(
            dateExtractionMatiz.valvulasout.data.rows.map(row => row.velocidad)
        );
        matrix.sort((a, b) => a - b);
        if (maxValues <= 1) {
            const numberOfGroups = 5;
            const groupSize = Math.ceil(matrix.length / numberOfGroups);
            let rangesValues = [];
            let previousMax = matrix[0] || 0; // Inicializamos el máximo anterior en el mínimo valor de la matriz

            for (let i = 0; i < numberOfGroups; i++) {
                const start = i * groupSize;
                const end = start + groupSize;
                const group = matrix.slice(start, end);

                const min = previousMax;
                const max = group[group.length - 1] || previousMax;


                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[i] });


                previousMax = max; // Actualizamos el máximo anterior para el siguiente grupo
            }

            return rangesValues;
        } else if (maxValues <= 2) {//4 cuantiles con valores menores a uno y de 1 al máximo
            const lessThanOneValues = matrix.filter(value => value < 1); // Valores menores a 1
            const oneToTwoValues = matrix.filter(value => value >= 1 && value < 2); // Valores entre 1 y 2
            let rangesValues = [];

            // Calcular 4 cuartiles para los valores menores a 1
            const numberOfQuantiles = 4;
            const quantileSize = Math.ceil(lessThanOneValues.length / numberOfQuantiles);

            let previousMax = 0; // Inicializamos el máximo anterior en 0, para el primer cuartil

            for (let i = 0; i < numberOfQuantiles; i++) {
                const start = i * quantileSize;
                const end = start + quantileSize;
                const group = lessThanOneValues.slice(start, end);

                const min = previousMax;
                let max = group[group.length - 1] || previousMax;
                if (i === (numberOfQuantiles - 1)) {
                    max = 1;
                }

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[i] });

                previousMax = max; // Actualizamos el máximo anterior para el siguiente cuartil
            }

            // Intervalo de 1 a 2
            if (oneToTwoValues.length > 0) {
                const min = 1;
                const max = oneToTwoValues[oneToTwoValues.length - 1];

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[4] });
            }
            return rangesValues;
        } else if (maxValues <= 3) {
            // Filtrar los valores en los diferentes rangos
            const lessThanOneValues = matrix.filter(value => value < 1); // Valores menores a 1
            const oneToTwoValues = matrix.filter(value => value >= 1 && value < 2); // Valores entre 1 y 2
            const greaterThanTwoValues = matrix.filter(value => value >= 2); // Valores mayores o iguales a 2
            let rangesValues = [];

            // Calcular cuartiles para los valores menores a 1
            const numberOfQuantiles = 3;
            const quantileSize = Math.ceil(lessThanOneValues.length / numberOfQuantiles);

            let previousMax = 0; // Inicializamos el máximo anterior en 0, para el primer cuartil

            for (let i = 0; i < numberOfQuantiles; i++) {
                const start = i * quantileSize;
                const end = start + quantileSize;
                const group = lessThanOneValues.slice(start, end);

                const min = previousMax;
                let max = group[group.length - 1] || previousMax;
                if (i === (numberOfQuantiles - 1)) {
                    max = 1;
                }

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[i] });

                previousMax = max; // Actualizamos el máximo anterior para el siguiente cuartil
            }

            // Intervalo de 1 a 2
            if (oneToTwoValues.length > 0) {
                const min = 1;
                const max = 2;// oneToTwoValues[oneToTwoValues.length - 1];

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[3] });

                previousMax = max; // Actualizamos el máximo anterior para el siguiente grupo
            }

            // Intervalo de 2 al máximo
            if (greaterThanTwoValues.length > 0) {
                const min = 2;
                const max = greaterThanTwoValues[greaterThanTwoValues.length - 1];

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[4] });
            }

            return rangesValues;

        } else {
            // Filtrar los valores en los diferentes rangos
            const lessThanOneValues = matrix.filter(value => value < 1); // Valores menores a 1
            const oneToThreeValues = matrix.filter(value => value >= 1 && value < 3); // Valores entre 1 y 3
            const greaterThanThreeValues = matrix.filter(value => value >= 3); // Valores mayores o iguales a 3

            let rangesValues = [];

            // Calcular cuartiles para los valores menores a 1
            const numberOfQuantiles = 3;
            const quantileSize = Math.ceil(lessThanOneValues.length / numberOfQuantiles);

            let previousMax = 0; // Inicializamos el máximo anterior en 0, para el primer cuartil

            for (let i = 0; i < numberOfQuantiles; i++) {
                const start = i * quantileSize;
                const end = start + quantileSize;
                const group = lessThanOneValues.slice(start, end);

                const min = previousMax;
                let max = group[group.length - 1] || previousMax;

                if (i === (numberOfQuantiles - 1)) {
                    max = 1;
                }

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[i] });

                previousMax = max; // Actualizamos el máximo anterior para el siguiente cuartil
            }

            // Intervalo de 1 a 3
            if (oneToThreeValues.length > 0) {
                const min = 1;
                const max = 3; //oneToThreeValues[oneToThreeValues.length - 1];

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[3] });

                previousMax = max; // Actualizamos el máximo anterior para el siguiente grupo
            }

            // Intervalo de 3 al máximo
            if (greaterThanThreeValues.length > 0) {
                const min = 3;
                const max = greaterThanThreeValues[greaterThanThreeValues.length - 1];

                rangesValues.push({ min: parseFloat(min.toFixed(3)), max: parseFloat(max.toFixed(3)), color: colorsValues[4] });
            }

            return rangesValues;

        }
        // return rangesValues = [
        //     { min: 0, max: 0.3, color: colorsValues[0] },
        //     { min: 0.3, max: 0.6, color: colorsValues[1] },
        //     { min: 0.6, max: 1, color: colorsValues[2] },
        //     { min: 1, max: 3, color: colorsValues[3] },
        //     { min: 3, max: Infinity, color: colorsValues[4] }
        // ];
    } else if (nameProperty === 'edad') {
        return rangesValues = [
            { min: 0, max: 3, color: colorsValues[0] },
            { min: 3, max: 24, color: colorsValues[1] },
            { min: 24, max: 48, color: colorsValues[2] },
            { min: 48, max: 72, color: colorsValues[3] },
            { min: 72, max: Infinity, color: colorsValues[4] }
        ];
    } else if (nameProperty === 'caudal') {
        let matrix = [];
        matrix = matrix.concat(
            dateExtractionMatiz.conduccionesout.data.rows.map(row => Math.abs(row.caudal))
        );
        matrix = matrix.concat(
            dateExtractionMatiz.valvulasout.data.rows.map(row => Math.abs(row.caudal))
        );

        matrix.sort((a, b) => a - b);

        const numberOfGroups = 5;
        const groupSize = Math.ceil(matrix.length / numberOfGroups);
        let rangesValues = [];
        let previousMax = matrix[0] || 0; // Inicializamos el máximo anterior en el mínimo valor de la matriz

        for (let i = 0; i < numberOfGroups; i++) {
            const start = i * groupSize;
            const end = start + groupSize;
            const group = matrix.slice(start, end);

            const min = previousMax;
            const max = group[group.length - 1] || previousMax;


            rangesValues.push({ min: parseFloat(min.toFixed(4)), max: parseFloat(max.toFixed(4)), color: colorsValues[i] });


            previousMax = max; // Actualizamos el máximo anterior para el siguiente grupo
        }

        return rangesValues;
    } else if (nameProperty === 'consumo') {
        let matrix = [];
        matrix = matrix.concat(
            dateExtractionMatiz.parcelasout.data.rows.map(row => Math.abs(row.consumo))
        );

        matrix.sort((a, b) => a - b);
        if (matrix[0] > 0) {
            const numberOfGroups = 5;
            const groupSize = Math.ceil(matrix.length / numberOfGroups);
            let rangesValues = [];
            let previousMax = matrix[0] || 0; // Inicializamos el máximo anterior en el mínimo valor de la matriz

            for (let i = 0; i < numberOfGroups; i++) {
                const start = i * groupSize;
                const end = start + groupSize;
                const group = matrix.slice(start, end);

                const min = previousMax;
                const max = group[group.length - 1] || previousMax;

                if (i === (numberOfGroups - 1)) {
                    rangesValues.push({ min: parseFloat(min.toFixed(2)), max: Infinity, color: colorsValues[i] });
                } else if (i === 0) {
                    rangesValues.push({ min: 0, max: parseFloat(max.toFixed(4)), color: colorsValues[i] });
                } else {
                    rangesValues.push({ min: parseFloat(min.toFixed(4)), max: parseFloat(max.toFixed(4)), color: colorsValues[i] });
                }

                previousMax = max; // Actualizamos el máximo anterior para el siguiente grupo
            }

            return rangesValues;
        } else if (matrix[0] === 0) {
            // Filtrar los valores en los diferentes rangos
            const zeroValues = matrix.filter(value => value === 0); // Valores iguales a 0
            const positiveValues = matrix.filter(value => value > 0); // Valores mayores a 0

            let rangesValues = [];

            // Grupo 1: Todos los valores iguales a 0
            if (zeroValues.length > 0) {
                const min = 0;
                const max = 0;

                rangesValues.push({ min: parseFloat(min.toFixed(4)), max: parseFloat(max.toFixed(4)), color: colorsValues[0] });
            }

            // Calcular cuartiles para los valores superiores a 0
            const numberOfQuantiles = 4;
            const quantileSize = Math.ceil(positiveValues.length / numberOfQuantiles);

            let previousMax = 0; // Inicializamos el máximo anterior en 0, para el primer cuartil

            for (let i = 0; i < numberOfQuantiles; i++) {
                const start = i * quantileSize;
                const end = start + quantileSize;
                const group = positiveValues.slice(start, end);

                const min = previousMax;
                const max = group[group.length - 1] || previousMax;

                // Ajuste del grupo, el máximo de un cuartil es el mínimo del siguiente
                if (i === (numberOfQuantiles - 1)) {
                    rangesValues.push({ min: parseFloat(min.toFixed(4)), max: Infinity, color: colorsValues[i + 1] });
                } else {
                    rangesValues.push({ min: parseFloat(min.toFixed(4)), max: parseFloat(max.toFixed(4)), color: colorsValues[i + 1] });
                }
                previousMax = max; // Actualizamos el máximo anterior para el siguiente cuartil
            }

            return rangesValues;
        }
    } else {
        // Calcular el rango total
        const rangeValues = maxValues - minValues;

        // Dividir el rango en 4 partes iguales
        const intervalValues = parseFloat((rangeValues / 6).toFixed(2));

        // Crear rangos asegurando 2 decimales
        return rangesValues = [
            { min: parseFloat(minValues.toFixed(2)), max: parseFloat((minValues + intervalValues).toFixed(2)), color: colorsValues[0], iconUrl: getIconMarkerValveColor(colorsValues[0]) },
            { min: parseFloat((minValues + intervalValues).toFixed(2)), max: parseFloat((minValues + 2 * intervalValues).toFixed(2)), color: colorsValues[1], iconUrl: getIconMarkerValveColor(colorsValues[1]) },
            { min: parseFloat((minValues + 2 * intervalValues).toFixed(2)), max: parseFloat((minValues + 3 * intervalValues).toFixed(2)), color: colorsValues[2], iconUrl: getIconMarkerValveColor(colorsValues[2]) },
            { min: parseFloat((minValues + 3 * intervalValues).toFixed(2)), max: parseFloat((minValues + 4 * intervalValues).toFixed(2)), color: colorsValues[3], iconUrl: getIconMarkerValveColor(colorsValues[3]) },
            { min: parseFloat((minValues + 4 * intervalValues).toFixed(2)), max: parseFloat(maxValues.toFixed(2)), color: colorsValues[4], iconUrl: getIconMarkerValveColor(colorsValues[1]) }
        ];
    }
}

const getColorForCota = (cota, nameProperty) => {
    // cota = parseFloat(cota).toFixed(2);
    // Buscar el color correspondiente a la cota
    for (let i = 0; i < propertiesWithColors.length; i++) {

        if (nameProperty === 'caudal' || nameProperty === 'velocidad') {
            if (i === (propertiesWithColors.length - 1)) {
                if ((Math.abs(cota) >= Math.abs(propertiesWithColors[i].min)) && (Math.abs(cota) <= Math.abs(propertiesWithColors[i].max))) {
                    return propertiesWithColors[i].color;
                }
            } else {
                if ((Math.abs(cota) >= Math.abs(propertiesWithColors[i].min)) && (Math.abs(cota) < Math.abs(propertiesWithColors[i].max))) {
                    return propertiesWithColors[i].color;
                }
            }
        } else if (nameProperty === 'consumo') {
            if (i === 0 && propertiesWithColors[i].min === 0 && propertiesWithColors[i].max === 0) {
                if ((Math.abs(cota) === Math.abs(propertiesWithColors[i].min))) {
                    return propertiesWithColors[i].color;
                }
            } else if (i === 0 && propertiesWithColors[i - 1].min === 0 && propertiesWithColors[i - 1].max === 0) {
                if ((Math.abs(cota) > Math.abs(propertiesWithColors[i].min)) && (Math.abs(cota) < Math.abs(propertiesWithColors[i].max))) {
                    return propertiesWithColors[i].color;
                }
            } else {
                if (i === (propertiesWithColors.length - 1)) {
                    if ((Math.abs(cota) >= Math.abs(propertiesWithColors[i].min)) && (Math.abs(cota) <= Math.abs(propertiesWithColors[i].max))) {
                        return propertiesWithColors[i].color;
                    }
                } else {
                    if ((Math.abs(cota) >= Math.abs(propertiesWithColors[i].min)) && (Math.abs(cota) < Math.abs(propertiesWithColors[i].max))) {
                        return propertiesWithColors[i].color;
                    }
                }
            }
        } else if (nameProperty === 'energia') {
            if (i === (propertiesWithColors.length - 1)) {
                if (cota >= propertiesWithColors[i].min && cota <= propertiesWithColors[i].max) {
                    return propertiesWithColors[i].color;
                }
            } else {
                if (cota >= propertiesWithColors[i].min && cota < propertiesWithColors[i].max) {
                    return propertiesWithColors[i].color;
                }
            }

        } else {
            if (cota >= propertiesWithColors[i].min && cota < propertiesWithColors[i].max) {
                return propertiesWithColors[i].color;
            }
        }

    }
    // Si la cota está fuera de los rangos, devolver un color por defecto /scripts/utils/web-worker.js
    return 'black';
};

var getIconMarkerValveColor = function (color) {
    var encoded = window.btoa(`
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 1024.000000 1024.000000" preserveAspectRatio="xMidYMid meet">
                            <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="${color}" stroke="none">
                                <path d="M4870 9024 c-400 -37 -756 -136 -1100 -309 -591 -295 -1073 -780 -1376 -1385 -138 -277 -220 -530 -275 -852 -26 -155 -37 -527 -20 -700 72 -737 403 -1396 1090 -2168 229 -257 1009 -1035 1680 -1677 l275 -263 70 67 c537 508 1761 1728 1934 1928 619 716 901 1249 1024 1940 20 117 23 161 23 440 0 338 -8 421 -65 653 -170 697 -572 1299 -1159 1740 -326 245 -744 439 -1122 521 -233 50 -362 63 -654 66 -154 1 -300 1 -325 -1z m673 -258 c691 -99 1292 -438 1771 -1001 172 -202 388 -574 481 -829 45 -124 97 -323 126 -491 20 -112 23 -166 23 -385 1 -299 -13 -418 -79 -680 -131 -520 -430 -1025 -941 -1590 -259 -286 -1753 -1770 -1783 -1770 -6 0 -11 4 -11 8 0 5 -84 89 -188 187 -326 311 -1198 1172 -1391 1375 -578 607 -906 1106 -1079 1640 -217 673 -158 1400 164 2020 73 140 218 361 320 490 85 107 345 367 444 446 141 111 352 244 514 323 326 161 528 216 996 275 78 9 529 -3 633 -18z"/>
                                <path d="M4980 8609 c-761 -47 -1440 -417 -1907 -1039 -121 -162 -174 -249 -264 -435 -163 -340 -229 -638 -229 -1042 0 -389 68 -688 234 -1028 131 -267 298 -497 522 -715 147 -144 225 -208 374 -307 710 -475 1629 -564 2441 -235 175 70 283 128 446 238 158 106 247 179 380 312 299 297 527 667 642 1037 112 363 137 766 71 1133 -147 814 -754 1555 -1550 1890 -262 111 -533 172 -845 192 -88 5 -167 9 -175 8 -8 0 -71 -4 -140 -9z m437 -224 c273 -36 495 -101 726 -213 709 -343 1226 -1023 1331 -1749 87 -604 -65 -1169 -447 -1664 -333 -432 -770 -725 -1272 -853 -232 -60 -322 -71 -595 -71 -258 0 -327 7 -530 52 -925 204 -1665 984 -1807 1903 -13 82 -18 171 -17 310 0 278 30 467 110 704 215 632 753 1190 1389 1441 174 69 372 117 590 144 119 14 395 12 522 -4z"/>
                                <path d="M4905 7788 c-230 -16 -473 -66 -581 -118 -128 -62 -200 -183 -177 -294 32 -150 155 -232 413 -275 63 -11 155 -23 203 -27 l88 -7 -3 -36 c-2 -25 -7 -35 -17 -33 -37 8 -96 -12 -132 -45 -32 -29 -40 -44 -45 -84 l-7 -49 -51 0 c-60 0 -116 -25 -133 -60 -15 -31 -18 -385 -3 -424 5 -14 24 -32 42 -40 l33 -14 -52 -1 -53 -1 0 85 c0 127 -40 189 -136 209 -31 7 -31 7 -38 89 -8 90 -21 118 -69 148 -28 18 -46 20 -154 17 -113 -3 -123 -5 -147 -27 -22 -20 -26 -33 -26 -78 0 -29 -4 -53 -10 -53 -5 0 -10 23 -10 51 0 43 -5 55 -29 80 -29 29 -30 29 -148 29 -182 0 -221 -28 -230 -169 l-6 -81 -37 -10 c-47 -13 -107 -77 -114 -122 -14 -95 -15 -122 -6 -165 12 -51 57 -108 98 -124 l22 -9 0 -268 0 -268 -28 -10 c-48 -18 -82 -74 -93 -151 -21 -145 21 -238 124 -272 33 -11 34 -13 39 -76 11 -131 56 -164 221 -165 149 0 187 21 187 105 0 22 4 34 10 30 6 -3 10 -21 10 -40 0 -79 30 -95 175 -95 170 0 212 31 222 164 l6 74 38 6 c47 8 104 55 121 102 14 40 35 44 83 14 42 -26 47 -42 39 -106 -8 -67 8 -115 45 -137 26 -15 77 -17 564 -17 l535 0 31 29 c30 28 31 32 31 113 0 76 2 87 24 107 13 12 40 24 60 28 30 5 36 3 36 -12 0 -26 36 -80 68 -101 15 -10 43 -20 62 -24 l35 -5 6 -71 c6 -80 23 -115 72 -144 27 -17 51 -20 150 -20 153 0 173 9 184 83 l7 52 8 -50 c11 -77 27 -85 164 -85 182 0 224 29 224 155 l0 73 45 11 c57 14 110 67 126 123 14 55 6 185 -15 225 -17 34 -71 83 -91 83 -7 0 -15 6 -17 13 -2 6 -2 128 0 269 l4 256 28 12 c35 15 76 57 89 93 12 31 14 131 5 189 -9 53 -65 115 -117 130 -23 7 -45 17 -49 23 -4 5 -8 39 -8 75 0 80 -24 124 -78 147 -29 12 -63 14 -151 11 -109 -4 -115 -6 -137 -32 -18 -20 -24 -40 -25 -79 l-2 -52 -6 59 c-5 47 -12 63 -34 82 -26 22 -36 24 -145 24 -182 0 -223 -31 -232 -173 l-5 -81 -42 -9 c-48 -9 -101 -58 -120 -110 -6 -18 -12 -65 -12 -104 l-1 -73 -50 0 c-27 0 -50 2 -50 5 0 3 15 11 34 19 46 19 48 37 44 269 l-3 187 -28 27 c-25 25 -35 28 -95 28 -37 0 -70 5 -74 10 -4 6 -8 24 -8 40 0 37 -30 88 -65 111 -16 10 -47 18 -76 18 l-49 1 0 38 c0 36 1 37 34 37 60 0 268 30 350 51 189 46 302 140 322 267 16 100 -57 218 -174 280 -180 96 -659 150 -1067 120z m541 -179 c121 -12 327 -50 389 -72 79 -29 114 -50 131 -83 17 -31 17 -36 2 -66 -41 -88 -282 -141 -694 -154 -315 -10 -659 19 -828 70 -66 20 -124 61 -132 92 -11 42 17 86 75 117 57 32 221 71 361 86 52 6 109 13 125 15 73 8 472 5 571 -5z m-257 -555 l61 -7 0 -123 c0 -67 -3 -124 -7 -126 -5 -2 -54 -2 -110 0 l-103 3 0 123 c0 67 3 126 7 129 8 9 72 9 152 1z m-309 -254 c0 -17 -7 -20 -50 -20 -43 0 -50 3 -50 20 0 17 7 20 50 20 43 0 50 -3 50 -20z m610 0 c0 -17 -7 -20 -50 -20 -43 0 -50 3 -50 20 0 17 7 20 50 20 43 0 50 -3 50 -20z m190 -250 l0 -90 -535 0 -535 0 0 90 0 90 535 0 535 0 0 -90z m-1904 -452 c-3 -293 -5 -629 -5 -745 l-1 -213 -105 0 -105 0 0 745 0 745 110 0 111 0 -5 -532z m344 -213 l0 -746 -102 3 -103 3 -1 743 0 742 103 0 103 0 0 -745z m2260 0 l0 -745 -100 0 -100 0 -2 543 c-1 298 -2 633 -3 745 l-1 202 103 0 103 0 0 -745z m347 300 c0 -242 -1 -576 -4 -742 l-6 -303 -101 0 -101 0 -3 745 -2 746 107 -3 108 -3 2 -440z m-3187 170 l0 -55 -60 0 c-33 0 -63 0 -67 0 -8 0 -16 78 -9 96 4 10 24 14 71 14 l65 0 0 -55z m760 0 l0 -55 -58 0 -58 0 -3 45 c-1 25 1 50 4 55 3 6 31 10 61 10 l54 0 0 -55z m1860 1 l0 -55 -37 -3 c-21 -2 -57 -1 -80 1 l-43 3 0 47 c0 26 3 51 7 54 3 4 39 7 80 7 l73 0 0 -54z m730 -1 l0 -55 -55 0 -55 0 0 55 0 55 55 0 55 0 0 -55z m-1327 -94 c6 -51 51 -109 102 -132 33 -16 67 -19 200 -19 l160 0 0 -138 c0 -75 -1 -187 -3 -248 l-2 -111 -31 -7 c-46 -9 -86 -42 -105 -86 -18 -40 -18 -40 -73 -40 -124 -1 -228 -89 -247 -209 l-7 -41 -413 0 -414 0 0 35 c0 52 -23 98 -72 147 -48 48 -99 68 -175 68 -49 0 -50 0 -62 39 -13 46 -48 77 -102 91 l-39 11 2 246 3 247 137 -2 c169 -4 209 6 265 63 37 36 43 48 43 84 l0 41 414 0 413 0 6 -39z m-2023 -866 l0 -55 -70 0 -70 0 0 48 c0 27 3 52 7 55 3 4 35 7 70 7 l63 0 0 -55z m763 47 c3 -4 3 -28 0 -55 l-6 -47 -58 0 -59 0 0 49 c0 30 5 51 13 54 19 8 105 8 110 -1z m1847 -52 l0 -60 -69 0 -69 0 -4 43 c-8 74 -4 77 73 77 l69 0 0 -60z m740 0 l0 -61 -57 3 -57 3 -2 49 c-2 27 -1 53 2 58 3 4 30 8 60 8 l54 0 0 -60z"/>
                                <path d="M5540 7529 c-36 -4 -102 -16 -147 -25 -77 -16 -86 -16 -134 -1 -70 23 -175 22 -221 -1 -35 -18 -39 -18 -150 0 -177 29 -285 24 -386 -18 -31 -13 -34 -16 -21 -29 32 -32 225 -67 452 -81 102 -7 109 -6 128 15 17 17 31 21 89 21 59 0 71 -3 84 -22 14 -20 20 -21 118 -14 207 13 422 54 461 87 l22 19 -23 20 c-46 39 -127 48 -272 29z"/>
                            </g>
                        </svg>`);

    return 'data:image/svg+xml;base64,' + encoded;
};

function capitalized_property(property) {
    return property.charAt(0).toUpperCase() + property.slice(1);
}

function property_units(property) {
    let propertyUnits;
    if (property == 'energia' || property == 'presion') {
        propertyUnits = '[m.c.a]'
    } else if (property == 'consumo' || property == 'caudal') {
        propertyUnits = '[L/s]'
    } else if (property == 'edad') {
        propertyUnits = '[h]'
    } else if (property == 'velocidad') {
        propertyUnits = '[m/s]'
    } else {
        propertyUnits = ''
    }
    return propertyUnits;
}

function getMinMaxFromMatiz(property, matiz) {
    let min = null;
    let max = null;

    // Recorrer todas las propiedades del objeto matiz
    for (const table in matiz) {
        if (matiz[table].success) {
            const rows = matiz[table].data.rows;

            // Recorrer todas las filas de la tabla
            rows.forEach(row => {
                if (row.hasOwnProperty(property)) {
                    const value = row[property];

                    if (min === null || value < min) {
                        min = value;
                    }

                    if (max === null || value > max) {
                        max = value;
                    }
                }
            });
        }
    }

    return { min, max };
}

// Fin funciones comunes

// Inicio recogida de datos

async function percentageExtraction(date) {
    let percentageExtraction = await fetch(
        `/getPercentageDate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedDate: date }),
        }
    );
    if (percentageExtraction.ok) {
        const data = await percentageExtraction.json();
        dateExtractionMatiz['certidumbre'] = data;
    } else {
        console.error('Error al extraer los datos del servidor');
    }
}

async function dataExtraction(date) {
    let dateExtraction = await fetch(
        `/getDataDate`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedDate: date }),
        }
    );
    if (dateExtraction.ok) {
        let data = await dateExtraction.json();
        data.forEach(function (dataTable) {
            dateExtractionMatiz[dataTable.table] = dataTable.data;
        });
    } else {
        console.error('Error al extraer los datos del servidor');
    }
}

async function historicalExtraction(table, id, varName) {


    let historicalExtraction = await fetch(
        `/getHistoricalData`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ table: table, id: id }),
        }
    );
    if (historicalExtraction.ok) {
        let title;
        const data = await historicalExtraction.json();
        if (!dateHistoricalExtractionMatiz[table]) {
            dateHistoricalExtractionMatiz[table] = {};
        }
        dateHistoricalExtractionMatiz[table][id] = data;
        let variableValue;
        switch (varName) {
            case 'toggleTanks':
                variableValue = toggleTanks;
                title = capitalized_property(variableValue) + ' - Depósito - ' + id;
                break;
            case 'toggleNodes':
                variableValue = toggleNodes;
                title = capitalized_property(variableValue) + ' - Nodo - ' + id;
                break;
            case 'toggleConductions':
                variableValue = toggleConductions;
                title = capitalized_property(variableValue) + ' - Conducción - ' + id;
                break;
            case 'toggleValves':
                variableValue = toggleValves;
                title = capitalized_property(variableValue) + ' - Válvula - ' + id;
                break;
            case 'togglePlots':
                variableValue = togglePlots;
                title = capitalized_property(variableValue) + ' - ' + id;//?
                break;
            default:
                console.error('Variable no reconocida:', varName);
                return; // Salir si varName no es reconocido
        }

        generateChart(data, variableValue, title);
    } else {
        console.error('Error al extraer los datos del servidor');
    }
}

async function purgesExtraction() {
    var loadingTitle = document.getElementById('loading_title');
    loadingTitle.innerHTML = 'Extrayendo datos...';
    const datetimePicker = document.getElementById('datetime-picker');
    const datetime = datetimePicker.value + ':00';
    let purgesExtraction = await fetch(
        `/getPurgesData`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedDate: datetime }),
        }
    );
    if (purgesExtraction.ok) {
        const data = await purgesExtraction.json();
        drawPurges(data.data.rows);
    } else {
        console.error('Error al extraer los datos del servidor');
    }
}

// Fin recogida de datos

// Inicio automatismo popup grafica/tabla

function openPopupElement() {
    var popupOverlay = document.getElementById('popupOverlay');
    var popup = document.getElementById('popup');

    popupOverlay.classList.add('show');
    popup.classList.add('expandWidth');

    setTimeout(function () {
        popup.classList.add('expandHeight');
    }, 500); // Tiempo para la expansión inicial a 10px x 50%

    setTimeout(function () {
        popup.classList.add('expandFull');
    }, 1000); // Tiempo para la expansión a 80% de ancho después de alcanzar el 50% de altura
}

document.getElementById('popupOverlay').addEventListener('click', function (event) {
    if (event.target === document.getElementById('popupOverlay')) {
        var popupOverlay = document.getElementById('popupOverlay');
        var popup = document.getElementById('popup');

        popup.classList.remove('expandFull');

        setTimeout(function () {
            popup.classList.remove('expandHeight');
            popup.classList.add('collapseWidth');
        }, 500); // Tiempo para la contracción inicial del ancho de 80% a 10px

        setTimeout(function () {
            popup.classList.remove('expandWidth', 'collapseWidth');
            popup.classList.add('collapseHeight');
        }, 1000); // Tiempo para la contracción final a 0px x 0px

        setTimeout(function () {
            popupOverlay.classList.remove('show');
            popup.classList.remove('collapseHeight');
        }, 1500); // Tiempo para asegurarse de que la contracción completa esté terminada antes de ocultar el overlay
    }
});

// Fin automatismo popup grafica/tabla

// Inicio generación de gráfica

function generateChart(data, property, title) {
    // Verificar que data tenga la estructura esperada
    if (!data.success || !data.data || !data.data.rows) {
        console.error('Estructura de datos incorrecta', data);
        return;
    }

    // Extraer los valores de data.rows
    const rows = data.data.rows;

    // Obtener la fecha inicial del elemento 'datetime-plot-line'
    const datetimePicker = document.getElementById('datetime-picker');
    const initialDate = new Date(datetimePicker.value);

    // Verificar si la fecha es válida
    const initialDateTime = new Date(datetimePicker.value).getTime();
    if (isNaN(initialDateTime)) {
        console.error('Fecha inválida:', initialDate);
        return;
    }

    // Inicio generación de gráfica

    // Asumimos que cada fila es un punto de datos
    const seriesData = rows.map((row, index) => {
        let yValue;
        if (property === 'estado') {
            yValue = row[property] === 'open' ? 1 : 0;
        } else {
            yValue = parseFloat(row[property].toFixed(2));
        }
        return {
            x: new Date(row.hora).getTime(),
            y: yValue
        };
    });

    Highcharts.setOptions({
        lang: {
            loading: 'Cargando...',
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            exportButtonTitle: "Exportar",
            printButtonTitle: "Importar",
            rangeSelectorFrom: "Desde",
            rangeSelectorTo: "Hasta",
            rangeSelectorZoom: "Período",
            downloadPNG: 'Descargar imagen PNG',
            downloadJPEG: 'Descargar imagen JPEG',
            downloadPDF: 'Descargar imagen PDF',
            downloadSVG: 'Descargar imagen SVG',
            printChart: 'Imprimir',
            resetZoom: 'Reiniciar zoom',
            resetZoomTitle: 'Reiniciar zoom',
            thousandsSep: ",",
            decimalPoint: '.',
            viewFullscreen: 'Ver en pantalla completa',
            exitFullscreen: 'Salir de pantalla completa'
        },
        global: { useUTC: false }
    });

    // Generar el gráfico usando Highcharts
    const chart = Highcharts.chart('chartContainer', {
        chart: {
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: title
        },
        credits: {
            enabled: false,
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Haga clic y arrastre en el gráfico para acercar e inspeccionar los datos.' :
                'Pellizque el gráfico para acercarlo',
            align: 'center'
        },
        xAxis: {
            type: 'datetime', // Eje x como tiempo
            plotLines: [{
                color: 'red', // Color de la línea
                width: 2, // Ancho de la línea
                value: new Date(initialDate).getTime(), // Fecha y hora de la línea
                zIndex: 5 // Asegura que la línea esté encima de otros elementos
            }]
        },
        yAxis: {
            title: {
                text: capitalized_property(property) + ' ' + property_units(property)
            },
            labels: {
                formatter: function () {
                    if (property === 'estado') {
                        return this.value === 1 ? 'Open' : 'Closed';
                    } else {
                        return this.value;
                    }
                }
            },
            tickPositions: property === 'estado' ? [0, 1] : undefined // Solo mostrar ticks en 0 y 1 si el property es 'estado'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [
                            1,
                            Highcharts.color(Highcharts.getOptions().colors[0])
                                .setOpacity(0).get('rgba')
                        ]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: '',
            data: seriesData,
            tooltip: {
                valueDecimals: 2 // Mostrar 2 decimales en el tooltip
            }
        }]
    });

    // Fin generación de gráfica

    // Inicio generación de tabla

    // Crear la tabla
    var tableHtml = '';
    tableHtml = `
                <div id="container-table-data" class="container_table_data container_table">
                   
                        <table class="table_data">
                            <thead>
                                <tr>
                                    <th>Fecha / Hora</th>
                                    <th>Valor ${property_units(property)}</th>
                                </tr>
                            </thead>
                            <tbody id="table" class="custom_scrollbar">
                                <!-- Aquí se generarán dinámicamente las filas de la tabla -->
                            </tbody>
                        </table>
           
                </div>
            `;
    $('#tableContainer').html(tableHtml);

    // Obtener referencia a la tabla
    var table = document.getElementById("table");

    // Agregar registros a la tabla
    for (var i = 0; i < rows.length; i++) {
        var registro = rows[i];
        var row = table.insertRow();
        var fechaHora = new Date(registro.hora).getTime();

        // Comprobar si la fecha/hora del registro coincide con la fecha seleccionada
        if (fechaHora === initialDateTime) {
            row.classList.add('highlighted-row');
        }

        var fechaCell = row.insertCell();
        var valorCell = row.insertCell();

        fechaCell.innerText = new Date(registro.hora).toLocaleString();
        valorCell.innerText = registro[property];
        if (fechaHora === initialDateTime) {
            fechaCell.classList.add('highlighted-cell');
            valorCell.classList.add('highlighted-cell');
        }
    }

    openPopupElement();
}

// Fin generación de gráfica/tabla

// Inicio funciones para cerrar infowindows
function closeCurrentInfoWindowIfFromLayer() {
    if (!currentInfowindow) return;

    const allInfoWindows = [
        infoWindowsTanks,
        infoWindowsNodos,
        infoWindowsConductions,
        infoWindowsValves,
        infoWindowsPlots
    ];

    for (const infoDict of allInfoWindows) {
        for (const key in infoDict) {
            if (infoDict[key] === currentInfowindow) {
                currentInfowindow.close();
                currentInfowindow = null;
                return;
            }
        }
    }
}

// Fin funciones para cerrar infowindows


//Inicio función para generar .zip con todos los datos de fecha y hora seleccionados

document.getElementById('button-export-to-excel').addEventListener('click', () => {
    loading_start()
    // Función para convertir un objeto en una hoja de cálculo
    function convertToSheet(data) {
        // Modificar las claves de los objetos para capitalizar las cabeceras
        const modifiedData = data.map(row => {
            const modifiedRow = {};
            for (let key in row) {
                if (row.hasOwnProperty(key)) {
                    modifiedRow[capitalized_property(key) + ' ' + property_units(key)] = row[key];
                }
            }
            return modifiedRow;
        });
        return XLSX.utils.json_to_sheet(modifiedData);
    }

    // Crear un libro de trabajo de Excel para cada conjunto de datos
    function createWorkbook(data) {
        const workbook = XLSX.utils.book_new();
        const sheet = convertToSheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
        return workbook;
    }

    // Crear y descargar los archivos Excel
    const datasets = {
        certidumbre: dateExtractionMatiz.certidumbre.data.rows,
        depositos: dateExtractionMatiz.depositosout.data.rows,
        nodos: dateExtractionMatiz.nodosout.data.rows,
        conducciones: dateExtractionMatiz.conduccionesout.data.rows,
        valvulas: dateExtractionMatiz.valvulasout.data.rows,
        parcelas: dateExtractionMatiz.parcelasout.data.rows,
    };

    const zip = new JSZip();
    const fileNames = Object.keys(datasets);

    fileNames.forEach(name => {
        const workbook = createWorkbook(datasets[name]);
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        zip.file(`${name}.xlsx`, s2ab(wbout), { binary: true });
    });

    // Obtener la fecha
    const datetimePicker = document.getElementById('datetime-picker');
    const dateStr = new Date(datetimePicker.value);
    const fileName = `extraccion_${dateStr.toISOString().slice(0, 10)}.zip`;

    // Generar el archivo ZIP y descargarlo
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        saveAs(content, fileName);
    });
    //loading_end()
});

//Fin función para generar .zip con todos los datos de fecha y hora seleccionados

document.addEventListener('DOMContentLoaded', function () {
    const containerLegend = document.getElementById('container-legend');
    const layerTab = document.getElementById('layer-tab');
    const toggleTab = document.getElementById('toggle-tab');
    const icon = toggleTab.querySelector('i');

    toggleTab.addEventListener('click', function () {
        if (containerLegend.classList.contains('hidden')) {
            containerLegend.classList.remove('hidden');
            layerTab.classList.add('layer_tab_network');
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        } else {
            containerLegend.classList.add('hidden');
            layerTab.classList.remove('layer_tab_network');
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
    });

    const innerElement = document.getElementById('inner-element-map');
    const buttonMapCondition = document.getElementById('button-map-condition');
    const buttonMapAnalysis = document.getElementById('button-map-analysis');

    buttonMapCondition.addEventListener('click', function () {
        innerElement.classList.add('change_map');
        if (!myMapAnalysis) {
            loading_sequence();
        }
    });

    buttonMapAnalysis.addEventListener('click', function () {
        innerElement.classList.remove('change_map');
    });
});