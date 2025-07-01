
    

    var myMapAnalysis = null;
    let drawingManager;
    let drawnShapes = [];
    let deleteMarkers = [];
    let currentInfowindowAnalysis = null;

    var tanksArrayAnalysis = [];
    let infoWindowsTanksAnalysis = {};
    let toggleTanksAnalysis = false;

    var nodeNetworkArrayAnalysis = [];
    let nodeWithFlowNetworkArrayAnalysis = [];
    let infoWindowsNodosAnalysis = {};
    let markerClusterAnalysis;
    let toggleNodesAnalysis = false;
    let dataShowAffectedNodesIndexada = {};
    let local = true;

    let trafficConductionsArrayAnalysis = [];
    let infoWindowsConductionsAnalysis = {};
    let arrowConductionsArrayAnalysis = [];
    let toggleConductionsAnalysis = false;
    let strokeWeightConductionsAnalysis = 2;
    let dataShowAffectedConductionsIndexada = {};
    let trafficSelectedConductionsArrayAnalysis = [];
    
    let plotsArrayAnalysis = [];
    let dataShowAffectedPlotsIndexada = {};

    let dateExtractionMatizAnalysis;
    let dateExtractionRangesMatizAnalysis = [];
    let dateSneakExtractionAnalysis = true;
    let layersHTMLAnalysis='';
    let legendHTMLAnalysis='';
    let affectedLegendHTMLAnalysis='';

    let propertiesWithColorsAnalysis;

    let arrayHistoricalPurge = [];




var customMapStylesAnalysis = [
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

async function loading_sequence(){
    await loading_start();
    await initializeMapAnalysis();
    await loading_end();
}

async function initializeMapAnalysis() {
    var loadingTitle = document.getElementById('loading_title');
    loadingTitle.innerHTML = 'Iniciando Mapa...';
        const { Map } = await google.maps.importLibrary("maps");
        const { DrawingManager } = await google.maps.importLibrary("drawing");

        myMapAnalysis = new Map(document.getElementById("container-map-analysis"), {
            zoom: targetZoom,
            streetViewControl: false,
            center: { lat: targetLatitude, lng: targetLongitude },
            styles: customMapStylesAnalysis,
            mapTypeId: 'terrain',
        });

        myMapAnalysis.addListener('zoom_changed', () => {
            const currentZoomAnalysis = myMapAnalysis.getZoom();
            // if (currentZoom < 17) {
            // }else{

            // }
        });

        drawingManager = new DrawingManager({
            drawingMode: null,
            drawingControl: false,
            polygonOptions: {
                fillColor: 'rgba(255, 0, 0, 0.5)',
                strokeColor: 'red',
                strokeWeight: 2,
            },
            rectangleOptions: {
                fillColor: 'rgba(255, 0, 0, 0.5)',
                strokeColor: 'red',
                strokeWeight: 2,
            },
            circleOptions: {
                fillColor: 'rgba(255, 0, 0, 0.5)',
                strokeColor: 'red',
                strokeWeight: 2,
            },
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon', 'rectangle', 'circle']
            }
        });

        drawingManager.setMap(myMapAnalysis);

        // google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        //     drawnShapes.push(event.overlay);
        // });
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
            const overlay = event.overlay;
            drawnShapes.push(overlay);
            addDeleteMarker(overlay);
            recalculateConductions();
        });

        await time_calculation_analysis();
        center_map_analysis();

        return Promise.resolve();
}

    function layer_loading(){
        paint_tank_analysis();
        paint_nodes_network_analysis();
        paint_traffic_conductions_analysis();
        paint_plots_analysis();
        loadHistoricalDataPurge();
    }

// Inicio funciones de depósitos
            
    function paint_tank_analysis(property){
        var color;
        var contentString;
        getAllDataTank.forEach(tank => {
            dateExtractionMatizAnalysis.depositosout.data.rows.forEach(tanks => {
                if(tank.id===tanks.id){
                    color =  get_color_for_cota_analysis(tanks.edad);
                    contentString = show_grafic_analysis('Depósito', tank.id, property, tanks.edad);
                }
            });
            
            const position = tank.geometrygood;
            const tankMarker  = new google.maps.Marker({
                position: { lat: position.x, lng: position.y },
                map: myMapAnalysis,
                icon: {
                    url: '/images/icons/marker_tank_'+color+'.png', // URL del icono
                    scaledSize: new google.maps.Size(38, 38) // Tamaño del icono
                }
            });
            const infowindow = new google.maps.InfoWindow({ content: contentString });
            tankMarker.addListener("click", () => {
                if (currentInfowindowAnalysis) {
                    currentInfowindowAnalysis.close();
                }

                infowindow.open(myMapAnalysis, tankMarker);
                currentInfowindowAnalysis = infowindow;
            });
            tanksArrayAnalysis.push(tankMarker);
            infoWindowsTanksAnalysis[tank.id] = infowindow;
            google.maps.event.addListenerOnce(infowindow, 'domready', function() {
                document.querySelectorAll('.button_historical').forEach(button => {
                    button.addEventListener('click', function() {
                        // historicalExtraction('depositosout', tank.id, 'toggleTanksAnalysis')
                    });
                });
            });
        });
    }

    function clear_paint_tank_analysis(){
        tanksArrayAnalysis.forEach(tankMarker => {
            tankMarker.setMap(null);
        });
        tanksArrayAnalysis = [];
    }

// Fin funciones de depósitos

// Inicio funciones de nodos

async function paint_nodes_network_analysis() {
    nodeNetworkArrayAnalysis = [];
    // Transformar la estructura de `rows` para que el `id` sea el índice
    
    dateExtractionMatizAnalysis.nodosout.data.rows.forEach(row => {
        dataShowAffectedNodesIndexada[row.id] = row;
    });

    getDataNodesNetwork.forEach(node => {
        const position = node.geometrygood;
        let color;
        color = get_color_for_cota_analysis(dataShowAffectedNodesIndexada[node.id].edad);
        // Crear un icono personalizado para cada nodo
        const iconoPersonalizado = {
            url: `data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="4" fill="${color}" /></svg>`,
            scaledSize: new google.maps.Size(8, 8)  // Tamaño del punto
        };
        

        const marker = new google.maps.Marker({
            position: { lat: position.x, lng: position.y },
            title: node.id.toString(),
            icon: iconoPersonalizado,
            id: node.id,
            originalDimension: node.edad,
            zIndex: 1100,
        });
        const contentString = show_grafic_analysis('Nodo', node.id); 
        const infowindow = new google.maps.InfoWindow({ content: contentString });
        marker.addListener("click", () => {
            if (currentInfowindowAnalysis) {
                currentInfowindowAnalysis.close();
            }

            infowindow.open(myMapAnalysis, marker);
            currentInfowindowAnalysis = infowindow;
            if(local){
                setTimeout(() => {
                    const tab1 = document.getElementById('tab1');
                    tab1.checked = true;
                    const tab2 = document.getElementById('tab2');
                    tab2.checked = false;
                    const tab3 = document.getElementById('tab3');
                    tab3.checked = false;
                }, 500); // Ajusta el tiempo si es necesario para que coincida con la carga del contenido
            }
        });

        nodeNetworkArrayAnalysis.push(marker);
        infoWindowsNodosAnalysis[node.id] = infowindow;
        google.maps.event.addListenerOnce(infowindow, 'domready', function() {
            const TablePurgeSelected = createHistoricalTablePurge(node.id);
            document.getElementById('historical-table-container-node').appendChild(TablePurgeSelected);
            // Selecciona el elemento que quieres aplicar el estilo
            const element = document.querySelector('.gm-style-iw-d');

            // Aplica los estilos
            element.style.overflow = 'hidden';
            element.style.margin = '0';
            // Inicio automatismos estimación de purgas
                
                const volumenEstimatePurge = document.getElementById('volumen-estimate-purge' );

                const hoursEstimatePurge = document.getElementById('hours-estimate-purge' );
                const minutesEstimatePurge = document.getElementById('minutes-estimate-purge' );
                const secondsEstimatePurge = document.getElementById('seconds-estimate-purge' );

                const lossCoefficientEstimatePurge = document.getElementById('loss-coefficient-estimate-purge' );
                const startTimeEstimatePurge = document.getElementById('start-time-estimate-purge' );

                const buttonEstimatePurge = document.getElementById('button-estimate-purge-'+node.id );
                const buttonClearInputsEstimatePurge = document.getElementById('button-clear-inputs-estimate-purge');

                function checkInputsEstimatePurge() {
                    if(!volumenEstimatePurge.value && !hoursEstimatePurge.value && !minutesEstimatePurge.value && !secondsEstimatePurge.value){
                        buttonEstimatePurge.disabled = true;
                    }else{
                        if(!startTimeEstimatePurge.value){
                            buttonEstimatePurge.disabled = true;
                        }else{
                            buttonEstimatePurge.disabled = false;
                        }
                    }

                    if(volumenEstimatePurge.value){
                        hoursEstimatePurge.disabled = true;
                        minutesEstimatePurge.disabled = true;
                        secondsEstimatePurge.disabled = true;
                    }else{
                        hoursEstimatePurge.disabled = false;
                        minutesEstimatePurge.disabled = false;
                        secondsEstimatePurge.disabled = false;
                    }

                    if(hoursEstimatePurge.value || minutesEstimatePurge.value || secondsEstimatePurge.value){
                        volumenEstimatePurge.disabled = true;
                    }else{
                        volumenEstimatePurge.disabled = false;
                    }

                    if(lossCoefficientEstimatePurge.value === '0' || lossCoefficientEstimatePurge.value === '0.'){
                        buttonEstimatePurge.disabled = true;
                    }
                }

                volumenEstimatePurge.addEventListener('keydown', function(e) {
                    // Permite: delete, tab, escape, enter, y punto decimal
                    if ([8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                        // Permite: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
                        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || 
                        // Permite: Inicio, Fin, Izquierda, Derecha
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        return;
                    }
                    
                    // Bloquea cualquier otro carácter que no sea un número
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57 || e.keyCode > 46)) && 
                        (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                });

                hoursEstimatePurge.addEventListener('keydown', function(e) {
                    // Permite: delete, tab, escape, y enter
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        // Permite: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
                        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || 
                        // Permite: Inicio, Fin, Izquierda, Derecha
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        return;
                    }
                    
                    // Bloquea cualquier otro carácter que no sea un número
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57 || e.keyCode > 46)) && 
                        (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }

                    if(parseInt(hoursEstimatePurge.value) > 99 && parseInt(hoursEstimatePurge.value) <= 999){
                        e.preventDefault();
                    }
                });

                minutesEstimatePurge.addEventListener('keydown', function(e) {
                    // Permite: delete, tab, escape, y enter
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        // Permite: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
                        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || 
                        // Permite: Inicio, Fin, Izquierda, Derecha
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        return;
                    }
                    
                    // Bloquea cualquier otro carácter que no sea un número
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57 || e.keyCode > 46)) && 
                        (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                    if(parseInt(minutesEstimatePurge.value) > 5 && parseInt(minutesEstimatePurge.value) <= 59){
                        e.preventDefault();
                    }
                });

                minutesEstimatePurge.addEventListener('blur', function() {
                    if (this.value.length === 1) {
                        this.value = '0' + this.value;
                    }
                });

                secondsEstimatePurge.addEventListener('keydown', function(e) {
                    // Permite: delete, tab, escape, y enter
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        // Permite: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
                        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || 
                        // Permite: Inicio, Fin, Izquierda, Derecha
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        return;
                    }
                    
                    // Bloquea cualquier otro carácter que no sea un número
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57 || e.keyCode > 46)) && 
                        (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }

                    if(parseInt(secondsEstimatePurge.value) > 5 && parseInt(secondsEstimatePurge.value) <= 59){
                        e.preventDefault();
                    }
                });

                secondsEstimatePurge.addEventListener('blur', function() {
                    if (this.value.length === 1) {
                        this.value = '0' + this.value;
                    }
                });

                lossCoefficientEstimatePurge.addEventListener('keydown', function(e) {
                    console.log(lossCoefficientEstimatePurge.value);
                    console.log(e.key);

                    if((lossCoefficientEstimatePurge.value==='0.' && e.key === '.') || e.key === '´+' || e.key === '´-'){
                        e.preventDefault();
                    }

                    if(([8].indexOf(e.keyCode) !== -1) || (parseInt(lossCoefficientEstimatePurge.value)===0 && e.key=='.')){
                        return;
                    }

                    

                    // Bloquea cualquier otro carácter que no sea un número
                    if (parseInt(lossCoefficientEstimatePurge.value)===1 || 
                        (!lossCoefficientEstimatePurge.value && parseInt(e.key)>1) || 
                        (
                            (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57 || e.keyCode > 46)) && 
                            (e.keyCode < 96 || e.keyCode > 105)
                        )) {
                        e.preventDefault();
                    } 
                    else if(parseInt(lossCoefficientEstimatePurge.value)===1 && e.key=='.'){
                        e.preventDefault();
                    }
                   

                    // const lossCoefficientEstimatePurge = document.getElementById('loss-coefficient-estimate-purge' );
                    if ([8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                        // Permite: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
                        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || 
                        // Permite: Inicio, Fin, Izquierda, Derecha
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        return;
                    }
                    
                    
                });

                volumenEstimatePurge.addEventListener('input', checkInputsEstimatePurge);
                hoursEstimatePurge.addEventListener('input', checkInputsEstimatePurge);
                minutesEstimatePurge.addEventListener('input', checkInputsEstimatePurge);
                secondsEstimatePurge.addEventListener('input', checkInputsEstimatePurge);
                lossCoefficientEstimatePurge.addEventListener('input', checkInputsEstimatePurge);
                startTimeEstimatePurge.addEventListener('change', function () {
                    checkInputsEstimatePurge();
                });

                buttonEstimatePurge.addEventListener('click', function() {
                    let estimatePurgeDataArray = [];
                    let hours = hoursEstimatePurge.value || '00';
                    let minutes = minutesEstimatePurge.value || '00';
                    let seconds = secondsEstimatePurge.value || '00';
                    let timeStringEstimatePurge = hours + ':' + minutes + ':' + seconds;
                    estimatePurgeDataArray.push(node.id);
                    if(lossCoefficientEstimatePurge.value){
                        estimatePurgeDataArray.push('si');
                        estimatePurgeDataArray.push(lossCoefficientEstimatePurge.value);
                    }else{
                        estimatePurgeDataArray.push('no');
                        estimatePurgeDataArray.push('');
                    }
    
                    if(volumenEstimatePurge.value){
                        estimatePurgeDataArray.push('volumen');
                        estimatePurgeDataArray.push(volumenEstimatePurge.value);
                    }else if(timeStringEstimatePurge){
                        estimatePurgeDataArray.push('tiempo');
                        estimatePurgeDataArray.push(timeStringEstimatePurge);
                    }

                    estimatePurgeDataArray.push(startTimeEstimatePurge.value);
                    estimate_purge(estimatePurgeDataArray);
                });

                buttonClearInputsEstimatePurge.addEventListener('click', clearInputsEstimatePurge);

                function clearInputsEstimatePurge() {
                    volumenEstimatePurge.value = '';
                    hoursEstimatePurge.value = '';
                    minutesEstimatePurge.value = '';
                    secondsEstimatePurge.value = '';
                    startTimeEstimatePurge.value = '';
                    lossCoefficientEstimatePurge.value = '';

                    volumenEstimatePurge.disabled = false;
                    hoursEstimatePurge.disabled = false;
                    minutesEstimatePurge.disabled = false;
                    secondsEstimatePurge.disabled = false;
                    lossCoefficientEstimatePurge.disabled = false;
                    startTimeEstimatePurge.disabled = false;
                    
                    checkInputsEstimatePurge();
                }

                clearInputsEstimatePurge();
                checkInputsEstimatePurge();

            // Fin automatismos estimación de purgas

            // Inicio automatismos consignas de purgas

                const volumenConsignmentPurge = document.getElementById('volumen-consignment-purge' );
                const timeStartConsignmentPurge = document.getElementById('time-start-consignment-purge');
                const timeEndConsignmentPurge = document.getElementById('time-end-consignment-purge');
                const buttonConsignmentPurge = document.getElementById('button-consignment-purge-'+node.id );

                const buttonClearInputsConsignmentPurge = document.getElementById('button-clear-inputs-consignment-purge');

                // Obtener la fecha y hora actual
                const now = new Date();

                // Convertir la fecha actual a un formato compatible con datetime-local: YYYY-MM-DDTHH:MM
                const maxDateTime = now.toISOString().slice(0, 16);

                // Establecer el valor máximo para el input de fecha/hora fin
                timeStartConsignmentPurge.max = maxDateTime;
                timeEndConsignmentPurge.max = maxDateTime;

                // Función para verificar los inputs
                function checkInputsConsignmentPurge() {
                    if (volumenConsignmentPurge.value && timeStartConsignmentPurge.value && timeEndConsignmentPurge.value) {
                        buttonConsignmentPurge.disabled = !(new Date(timeEndConsignmentPurge.value) > new Date(timeStartConsignmentPurge.value));
                    } else {
                        buttonConsignmentPurge.disabled = true;
                    }
                    // const valueConsignmentPurge = parseFloat(volumenConsignmentPurge.value);
                    // console.log(valueConsignmentPurge)
                    // console.log(valueConsignmentPurge.length)
                    // buttonClearInputsConsignmentPurge.disabled = !(
                    //     volumenConsignmentPurge.value ||
                    //     timeStartConsignmentPurge.value ||
                    //     timeEndConsignmentPurge.value ||
                    //     (!isNaN(volumenValue) && volumenValue > 0)
                    // );
                }

                volumenConsignmentPurge.addEventListener('keydown', function(e) {
                    // Permite: delete, tab, escape, enter, y punto decimal
                    if ([8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                        // Permite: Ctrl/cmd+A, Ctrl/cmd+C, Ctrl/cmd+X
                        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) || 
                        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) || 
                        // Permite: Inicio, Fin, Izquierda, Derecha
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                        return;
                    }
                    
                    // Bloquea cualquier otro carácter que no sea un número
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57 || e.keyCode > 46)) && 
                        (e.keyCode < 96 || e.keyCode > 105)) {
                        e.preventDefault();
                    }
                });

                // Limitar fecha/hora fin según la fecha/hora inicio
                timeStartConsignmentPurge.addEventListener('change', function () {
                    timeEndConsignmentPurge.min = timeStartConsignmentPurge.value;
                    checkInputsConsignmentPurge();
                });

                // Verificar que la fecha/hora fin sea mayor a la fecha/hora inicio
                timeEndConsignmentPurge.addEventListener('change', function () {
                    timeStartConsignmentPurge.max = timeEndConsignmentPurge.value;
                    checkInputsConsignmentPurge();
                });

                // Función para limpiar los inputs
                function clearInputsConsignmentPurge() {
                    volumenConsignmentPurge.value = '';
                    timeStartConsignmentPurge.value = '';
                    timeEndConsignmentPurge.value = '';
                    timeEndConsignmentPurge.min = '';

                    const now = new Date();

                    const maxDateTime = now.toISOString().slice(0, 16);

                    timeStartConsignmentPurge.max = maxDateTime;

                    checkInputsConsignmentPurge(); 
                }

                volumenConsignmentPurge.addEventListener('input', checkInputsConsignmentPurge);

                buttonClearInputsConsignmentPurge.addEventListener('click', clearInputsConsignmentPurge);

                checkInputsConsignmentPurge();
                        
                buttonConsignmentPurge.addEventListener('click', function() {
                    const resultSeconds = calculateSeconds();
                    console.log(resultSeconds)
                    const resultCaudal = volumenConsignmentPurge.value / resultSeconds;
                    console.log(resultCaudal)
                    popup_insert_consignment_purge(node.id, timeStartConsignmentPurge.value, timeEndConsignmentPurge.value, volumenConsignmentPurge.value, resultCaudal);
                });
                infowindow.addListener('close', function () {
                    clearInputsEstimatePurge();
                    clearInputsConsignmentPurge();
                });

            // Fin automatismos consignas de purgas
        });
    });

    function calculateSeconds() {
        // Obtener los valores de los inputs
        let startTime = document.getElementById('time-start-consignment-purge').value;
        let endTime = document.getElementById('time-end-consignment-purge').value;
        
        // Verificar que ambos campos tengan un valor
        if (startTime && endTime) {
            // Convertir los valores a objetos de tipo Date
            let startDate = new Date(startTime);
            let endDate = new Date(endTime);
            
            // Obtener la diferencia en milisegundos
            let differenceInMillis = endDate - startDate;
            
            // Convertir la diferencia en segundos
            let differenceInSeconds = differenceInMillis / 1000;
            
            // Mostrar el resultado
            return differenceInSeconds;
        } else {
            console.error('Por favor, ingrese ambas fechas.');
        }
    }

    markerClusterAnalysis = new MarkerClusterer(myMapAnalysis, nodeNetworkArrayAnalysis, {
        imagePath: '/images/icons/icon-marker-clusterer-blue',
        styles: [{
            height: 53,
            width: 53,
            textColor: 'black',
            textSize: 14,
            marginTop: 19,
            url: getGoogleClusterInlineSvgAnalysis('#999'), // Asegúrate de que esta ruta es correcta
        }],           
        gridSize: 50,
        maxZoom: 16,
        title: 'node'
    });

    google.maps.event.addListener(markerClusterAnalysis, 'clusteringend', function(clustererAnalysis) {
        clustersMarkersAnalysis = clustererAnalysis.getClusters();
    });

}

var getGoogleClusterInlineSvgAnalysis = function (color) {
    var encoded = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-100 -100 200 200"><defs><g id="a" transform="rotate(45)"><path d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z" fill-opacity="0.7"/><path d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z" fill-opacity="0.5"/><path d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z" fill-opacity="0.3"/></g></defs><g fill="' + color + '"><circle r="42"/><use xlink:href="#a"/><g transform="rotate(120)"><use xlink:href="#a"/></g><g transform="rotate(240)"><use xlink:href="#a"/></g></g></svg>');

    return ('data:image/svg+xml;base64,' + encoded);
};

// Función para pintar los nodos del mapa
async function activation_deactivation_node_property_analysis(property) {
    loading_start();
        let color;
        let contentString 
        for (const marker of nodeNetworkArrayAnalysis) {
            await new Promise(resolve => {
                dateExtractionMatiz.nodosout.data.rows.forEach(nodes => {
                    if (marker.id === nodes.id) {
                        if (!toggleNodes) {
                            color = 'black';
                            contentString = show_grafic_analysis('Nodo', nodes.id); 
                        } else {
                            color = get_color_for_cota_analysis(nodes[property]);
                            marker.edad = nodes.edad;
                            contentString = show_grafic_analysis('Nodo', nodes.id, property, nodes.edad); 
                        }
                        // Actualizar el contenido de la InfoWindow
                        const infowindow = infoWindowsNodosAnalysis[marker.id];
                        if (infowindow) {
                            infowindow.setContent(contentString);
                        }
                        google.maps.event.addListenerOnce(infowindow, 'domready', function() {
                            document.querySelectorAll('.button_historical').forEach(button => {
                                button.addEventListener('click', function() {
                                    historicalExtraction('nodosout', nodes.id, 'toggleNodes')
                                });
                            });
                        });
                    }
                });
                const iconoPersonalizado = {
                    url: `data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="4" fill="${color}" /></svg>`,
                    scaledSize: new google.maps.Size(8, 8)  // Tamaño del punto
                };
                marker.setIcon(iconoPersonalizado);
                resolve();
            });
        }
    loading_end();
}

// Función para ocultar los nodos y grupos de nodos del mapa
function clear_nodes_network_analysis() {
    nodeNetworkArrayAnalysis.forEach(marker => {
        
        if (typeof marker.setVisible === 'function') {
            marker.setVisible(false);
        } else {
            console.error('El objeto marker no tiene el método setVisible:', marker);
        }
    });
    // Ocultar todos los marcadores dentro de los clusters
    markerClusterAnalysis.getMarkers().forEach(marker => {
        if (marker instanceof google.maps.Marker) {
            marker.setVisible(false);
        }
    });
    markerClusterAnalysis.clearMarkers();
}

// Función para mostrar los nodos y grupos de nodos del mapa
function show_nodes_network_analysis() {
    nodeNetworkArrayAnalysis.forEach(marker => {
        if (typeof marker.setVisible === 'function') {
            // const infowindow = infoWindowsNodosAnalysis[marker.id];
            // if (infowindow) {
            //     infowindow.setContent(`
            //         <div><strong>ID:</strong> ${marker.id}</div>
            //         <div><strong>Cota:</strong> ${marker.originalDimension}</div>
            //         <button class="button_historical">Histórico</button>
            //     `);
            // }
            marker.setVisible(true);
            // const iconoPersonalizado = {
            //     url: `data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="4" fill="black" /></svg>`,
            //     scaledSize: new google.maps.Size(8, 8)  // Tamaño del punto
            // };
    
            // marker.setIcon(iconoPersonalizado);
            // google.maps.event.addListenerOnce(infowindow, 'domready', function() {
            //     document.querySelectorAll('.button_historical').forEach(button => {
            //         button.addEventListener('click', function() {
            //             // historicalExtraction('nodosout', marker.id, 'toggleNodes')
            //         });
            //     });
            // });
        } else {
            console.error('El objeto marker no tiene el método setVisible:', marker);
        }
    });

    // Volver a agregar los marcadores al MarkerClusterer
    markerClusterAnalysis.addMarkers(nodeNetworkArrayAnalysis);
}

function draw_purges_analysis(){
    // Iterar sobre los nodos y dibujar los marcadores
    nodeNetworkArrayAnalysis.forEach(node => {
        const color = node.color;
        // Verificar si el nodo está en la lista de nodos con caudal
        const nodoConCaudal = arrayHistoricalPurge.find(nodo => nodo.id === node.id);
        
        // Si el nodo tiene caudal, le colocamos un icono encima del punto del nodo
        if(nodoConCaudal){
            node.caudal = nodoConCaudal.Caudal_Equivalente;

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
            nodeWithFlowNetworkArrayAnalysis.push(marker);
            // Añadir el marcador al mapa (asumiendo que myMapAnalysis es tu mapa de Google)
            marker.setMap(myMapAnalysis);
        };

       
    });
}

function delete_purges_analysis() {
    nodeWithFlowNetworkArrayAnalysis.forEach(nodeWithFlow => {
        nodeWithFlow.setMap(null);
    });
    nodeNetworkArrayAnalysis.forEach(node => {
        const nodoConCaudal = nodeWithFlowNetworkArrayAnalysis.find(nodeWithFlow => nodeWithFlow.id === node.id);
        if(nodoConCaudal){
            node.caudal = null;
            nodoConCaudal.setMap(null);
        }
    });
    nodeWithFlowNetworkArrayAnalysis = [];
}

// Fin funciones de nodos


// Inicio funciones de conducciones

function paint_traffic_conductions_analysis() {
    // Transformar la estructura de `rows` para que el `id` sea el índice
    dateExtractionMatizAnalysis.conduccionesout.data.rows.forEach(row => {
        dataShowAffectedConductionsIndexada[row.id] = row;
    });
    getDataTrafficConductions.forEach(conduction => {
        let coordinates = searchStartEndAnalysis(conduction.ninicio, conduction.nfinal)
        let color;
        const conductionCoords = []; // Array para almacenar las coordenadas de los puntos de la tubería

        color = get_color_for_cota_analysis(dataShowAffectedConductionsIndexada[conduction.id].edad);
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
            strokeColor: color, // Color de la línea
            strokeOpacity: 1.0, // Opacidad de la línea
            strokeWeight: strokeWeightConductions, // Grosor de la línea
            material: conduction.material,
            diameter: conduction.diametro/1000,
            length: conduction.longitud,
            coordinates: coordinates,
            zIndex: 1000,
        });
        // Agregar la polilínea al mapa y a la variable global
        polyline.setMap(myMapAnalysis);
        trafficConductionsArrayAnalysis.push(polyline);
        
        // const contentString = show_grafic_analysis('Conducción', conduction.id);
        
        // polyline.addListener("click", () => {
            
        //     // Calcular el punto medio de la polyline
        //     const midPoint = getPolylineMidPointAnalysis(polyline);
        //     let infowindow = new google.maps.InfoWindow({
        //         content: contentString,
        //         position: midPoint // Usar el punto medio como posición para el InfoWindow
        //     });
        
            
        //     if (currentInfowindowAnalysis) {
        //         currentInfowindowAnalysis.close();
        //     }

        //     infowindow.open(myMapAnalysis);
        //     currentInfowindowAnalysis = infowindow;
        //     infoWindowsConductionsAnalysis[conduction.id] = infowindow;
        // });
    });
}

function searchStartEndAnalysis(inicio, fin){
    let coordenadasInicio;
    let coordenadasFin;
    getDataNodesNetwork.forEach(function(node) {
        if (node.id === inicio){
            coordenadasInicio = node.geometrygood;
        } 
        if (node.id === fin){
            coordenadasFin = node.geometrygood;
        }
    });
    if(typeof coordenadasInicio === 'undefined' || typeof coordenadasFin === 'undefined'){
        getAllDataTank.forEach(tank => {
            if (tank.id === inicio){
                coordenadasInicio = tank.geometrygood;
            } 
            if (tank.id === fin){
                coordenadasFin = tank.geometrygood;
            }
        });
    }
    let coordenatesArrayAnalysis = [{x: coordenadasInicio.y, y: coordenadasInicio.x}, {x: coordenadasFin.y, y: coordenadasFin.x}];
    return coordenatesArrayAnalysis;
}

// Función para calcular el punto medio de una polyline
function getPolylineMidPointAnalysis(polyline) {
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

// Función para ocultar las conducciones del mapa
function clear_traffic_conductions_analysis() {
    trafficConductionsArrayAnalysis.forEach(polyline => {
        if (typeof polyline.setVisible === 'function') {
            polyline.setVisible(false);
        } else {
            console.error('El objeto polyline no tiene el método setVisible:', polyline);
        }
    });
}

// Función para mostrar las conducciones del mapa
function show_traffic_conductions_analysis() {
    trafficConductionsArrayAnalysis.forEach(polyline => {
        if (typeof polyline.setVisible === 'function') {
            polyline.setVisible(true);
        } else {
            console.error('El objeto polyline no tiene el método setVisible:', polyline);
        }
    });
}

function repainted_traffic_conductions_analysis() {
    trafficConductionsArrayAnalysis.forEach(polyline => {
        color = get_color_for_cota_analysis(dataShowAffectedConductionsIndexada[polyline.id].edad);
        polyline.setOptions({
            strokeColor: color,
            zIndex: 1000,
        });
    });
}

// Función para colorear las conducciones del mapa
async function activation_deactivation_conductions_property_analysis(property) {
    loading_start();
    trafficConductionsArrayAnalysis.forEach(polyline => {
            let color, contentString;
            if (toggleConductionsAnalysis) {
                dateExtractionMatiz.conduccionesout.data.rows.forEach(conductions => { 
                    if (polyline.id === conductions.id) { 
                        color = getColorForCota(conductions[property]);
                        polyline.cota = conductions[property];
                        contentString = show_grafic_analysis('Conducción', polyline.id, property, conductions[property]);
                    }
                });
            } else {
                color = 'black';
                contentString = show_grafic_analysis('Conducción', polyline.id);
            }
            polyline.setOptions({
                strokeColor: color
            });
        
            // // Actualizar el contenido de la InfoWindow
            // let infowindow = infoWindowsConductionsAnalysis[polyline.id];
            // const midPoint = getPolylineMidPointAnalysis(polyline);
        
            // if (infowindow) {
            //     infowindow.setContent(contentString);
            //     infowindow.setPosition(midPoint); // Usar el punto medio como posición para el InfoWindow
            // } else {
            //     infowindow = new google.maps.InfoWindow({
            //         content: contentString,
            //         position: midPoint
            //     });
            //     infoWindowsConductionsAnalysis[polyline.id] = infowindow; // Guardar la nueva InfoWindow en el array
            // }
        
            // if (infowindow && toggleConductionsAnalysis) {
            //     google.maps.event.addListenerOnce(infowindow, 'domready', function() {
            //         document.querySelectorAll('.button_historical').forEach(button => {
            //             button.addEventListener('click', function() {
            //                 historicalExtraction('conduccionesout', polyline.id, 'toggleConductionsAnalysis');
            //             });
            //         });
            //     });
            // }
        });
    loading_end();
}

// Fin funciones de conducciones

// Inicio funciones de parcelas

    function paint_plots_analysis() {
        // Transformar la estructura de `rows` para que el `id` sea el índice
        
        dateExtractionMatizAnalysis.parcelasout.data.rows.forEach(row => {
            dataShowAffectedPlotsIndexada[row.id] = row;
        });
        let color;
        let edad;
        getAllDemandPlots.forEach(function(plot) {
            var coordinates = plot.geometrygood;
            var plotCoords = [];
            edad = dataShowAffectedPlotsIndexada[plot.refcat].edad
            color = get_color_for_cota_analysis(edad);
            
            coordinates.forEach(function(coord) {
                var lat = parseFloat(coord.y);
                var lng = parseFloat(coord.x);

                if (!isNaN(lat) && !isNaN(lng)) {
                    plotCoords.push({
                        lat: lat,
                        lng: lng
                    });
                } else {
                    console.error("Coordenadas inválidas:", coord);
                }
            });

            if (plot && plot.gemelo) {
                var polygon = new google.maps.Polygon({
                    id: plot.refcat,
                    refcat: plot.refcat,
                    gemelo: plot.gemelo,
                    paths: plotCoords,
                    strokeColor: "#545454",
                    strokeOpacity: 0.4,
                    strokeWeight: 1,
                    fillColor: color,
                    fillOpacity: 0.6,
                    edad: edad,
                });

                if (typeof polygon.setMap === 'function') {
                    polygon.setMap(myMapAnalysis);
                    plotsArrayAnalysis.push(polygon);

                    const bounds = new google.maps.LatLngBounds();
                    plotCoords.forEach(coord => bounds.extend(coord));

                    const contentString = `
                        <div>
                            <h3>Parcela: ${plot.refcat}</h3>
                            <br>
                            <button id="graficar-button" onclick="historical_extractions_analysis('${plot.refcat}', ${edad});">Gráfica</button>
                        </div>
                    `;

                    const infowindow = new google.maps.InfoWindow({ content: contentString });

                    polygon.addListener("click", (event) => {
                        // Las coordenadas del clic
                        const clickedLocation = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng()
                        };
                        if (currentInfowindowAnalysis) {
                            currentInfowindowAnalysis.close();
                        }
                        infowindow.setPosition(clickedLocation);
                        infowindow.open(myMapAnalysis);
                        currentInfowindowAnalysis = infowindow;

                        myMapAnalysis.fitBounds(bounds);
                    });
                } else {
                    console.error("El polígono no tiene el formato correcto y no puede ser pintado en el mapa: ", plot.refcat);
                }
            }
        });
    }



    // Función para ocultar las parcelas del mapa
    function clear_plots_analysis() {
        plotsArrayAnalysis.forEach(polygon => {
            
            if (typeof polygon.setVisible === 'function') {
                polygon.setVisible(false);
            } else {
                console.error('El objeto polygon no tiene el método setVisible:', polygon);
            }
        });
    }

    // Función para mostrar las parcelas del mapa
    function show_plots_analysis() {
        plotsArrayAnalysis.forEach(polygon => {
            if (typeof polygon.setVisible === 'function') {
                polygon.setVisible(true);
            } else {
                console.error('El objeto polygon no tiene el método setVisible:', polygon);
            }
        });
    }

    // Función para mostrar las parcelas del mapa
    function paint_affected_plots_analysis(dataShowAffectedPlotsIndexada) {
        const superacion = parseInt(document.getElementById('superacion').value, 10);
        plotsArrayAnalysis.forEach(polygon => {
           
            if (dataShowAffectedPlotsIndexada[polygon.refcat]>=parseInt(superacion)){
                polygon.setOptions({
                    strokeColor: 'red',
                    strokeOpacity: 0.4,
                    strokeWeight: 1,
                    fillColor: 'red',
                    fillOpacity: 0.6,
                });
            }else{
                polygon.setOptions({
                    strokeColor: 'blue',
                    strokeOpacity: 0.4,
                    strokeWeight: 1,
                    fillColor: 'blue',
                    fillOpacity: 0.6,
                });
            }
        });
        create_affected_legend_analysis();
    }

// Fin funciones de parcelas

// Inicio funciones comunes

    function time_calculation_analysis(){
        var loadingTitle = document.getElementById('loading_title');
        loadingTitle.innerHTML = 'Calculando Fecha...';
        // Obtener la fecha y hora actual
        const now = new Date();
        const offset = now.getTimezoneOffset();
        
        // Restar un día (24 horas * 60 minutos * 60 segundos * 1000 milisegundos)
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        const yesterday = new Date(now.getTime() - oneDayInMilliseconds);
        
        // Ajustar la fecha de antes de ayer a la zona horaria local
        const localBeforeYesterday = new Date(yesterday.getTime() - (offset * 60 * 1000));

        // Obtener las fechas en formato 'YYYY-MM-DDTHH:00' (horas completas)
        let localFormattedBeforeYesterday = localBeforeYesterday.toISOString().slice(0, 13) + ":00:00";

        // localFormattedBeforeYesterday = "2024-07-15T14:00:00";// Retirar esta línea en modo real
        data_extraction_analysis(localFormattedBeforeYesterday);

    }

    async function data_extraction_analysis(dateAnalysis) {
        var loadingTitle = document.getElementById('loading_title');
        loadingTitle.innerHTML = 'Extrayendo datos...';
        dateSneakExtractionAnalysis = true;
    
        try {
            let dateExtractionAnalysis = await fetch(
                `/getDataDateAnalysis`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ selectedDate: dateAnalysis }),
                }
            );
            if (dateExtractionAnalysis.ok) {
                let dataAnalysis = await dateExtractionAnalysis.json();
                if (Array.isArray(dataAnalysis)) {
                    if (typeof dateExtractionMatizAnalysis === 'undefined') {
                        dateExtractionMatizAnalysis = {};
                    }
                    
                    for (const dataTable of dataAnalysis) {
                        if (dataTable && dataTable.table && dataTable.data && dataTable.data.data.rows) {
                            if (!dateExtractionMatizAnalysis[dataTable.table]) {
                                dateExtractionMatizAnalysis[dataTable.table] = {};
                            }
                            dateExtractionMatizAnalysis[dataTable.table] = dataTable.data;
                        } else {
                            console.warn(`Datos inválidos para la tabla: ${dataTable ? dataTable.table : 'desconocida'}`);
                            dateSneakExtractionAnalysis = false;
                        }
                    }
                    var loadingTitle = document.getElementById('loading_title');
                    loadingTitle.innerHTML = 'Generando Leyenda...';
                    if(dateSneakExtractionAnalysis){
                        await create_age_legend_analysis();
                    }
                } else {
                    console.error('El formato de los datos recibidos no es un array.');
                }
            } else {
                console.error('Error al extraer los datos del servidor');
            }
        } catch (error) {
            console.error('Error en la solicitud de extracción de datos:', error);
        }
    }
    

    function create_age_legend_analysis() {
        
        legendHTMLAnalysis = `
            <div class="head_conductions_legend">
                <h3 class="title_conductions_legend">Edad del Agua [h]</h3>
            </div>
            <div class="body_conductions_legend">
        `;
        propertiesWithColorsAnalysis = get_range_values_analysis();
        propertiesWithColorsAnalysis.forEach((element, index) => {
            legendHTMLAnalysis += `
                <div class="type_${index + 1}_conductions_legend range_legend_analysis">
                    <div class="type_${index + 1}_conductions_material_legend_icon" style="background-color: ${element.color};"></div>
                    <p>`;
                    if(parseInt(element.min) === 72){
                        legendHTMLAnalysis += `&ge; ${parseInt(element.min)}</p>`;
                    }else{
                        legendHTMLAnalysis += `&ge; ${parseInt(element.min)} - < ${parseInt(element.max)}</p>`;
                    }
            legendHTMLAnalysis += `        
                </div>
            `;
        });
        legendHTMLAnalysis += `
            </div>
        `;
        paint_container_legend_map_analysis();
    }

    function get_range_values_analysis() {
        // Convertir los intervalos de horas a minutos
        const intervals = [
            { min: 0, max: 3 },       // 0 a 3 horas
            { min: 3, max: 24 },    // 3 a 24 horas
            { min: 24, max: 48 },   // 24 a 48 horas
            { min: 48, max: 72 },   // 48 a 72 horas
            { min: 72, max: 525600 } // 72 horas a máximo valor
        ];
        
        // Definir colores para cada rango 
        const colorsValues = ['blue', 'green', 'yellow', 'orange', 'maroon']; 
        
        // Crear rangos asegurando 2 decimales
        const rangesValues = intervals.map((interval, index) => ({
            min: parseFloat(interval.min.toFixed(2)),
            max: parseFloat(interval.max.toFixed(2)),
            color: colorsValues[index]
        }));

        // Ajustar el último rango para que sea mayor a 72 horas
        // rangesValues[rangesValues.length - 1].max = parseFloat(maxValues.toFixed(2));
        return rangesValues;
    }

    const get_color_for_cota_analysis = (cota) => {
        cota = parseFloat(cota).toFixed(2);
        // Buscar el color correspondiente a la cota
        for (const range of propertiesWithColorsAnalysis) {
            if (cota >= range.min && cota <= range.max) {
                return range.color;
            }
        }
    
        // Si la cota está fuera de los rangos, devolver un color por defecto /scripts/utils/web-worker.js
        return 'black';
    };

    function create_affected_legend_analysis() {
        affectedLegendHTMLAnalysis = `
            <div class="container_affected_legend_analysis">
                <div class="head_affected_legend_analysis">
                    <h3 class="title_conductions_legend">Parcelas Afectadas</h3>
                </div>
                <div class="body_affected_legend_analysis">
                    <div class="type_affected_conductions_legend range_affected_legend_analysis">
                        <div class="type_affected_conductions_material_legend_icon" style="background-color: blue;"></div>
                        <p>Cumple Límite</p>
                    </div>
                    <div class="type_affected_conductions_legend range_affected_legend_analysis">
                        <div class="type_affected_conductions_material_legend_icon" style="background-color: red;"></div>
                        <p>No Cumple Límite</p>
                    </div>
                </div>
            </div>
        `;
        const subcontainerLegend = document.getElementById('subcontainer-legend-map-analysis');
        subcontainerLegend.innerHTML = affectedLegendHTMLAnalysis;
    }

    function show_grafic_analysis(type, id, nameValue, value, refcat){

        if (type == 'Nodo') {
            var HTMLContent = `
                <div class='HTMLContent_container'>
                    <div class='HTMLContent_container_type'>
                        <label class='HTMLContent_label_type'>
                            Tipo:
                        </label>
                        <span class='HTMLContent_span_type'>
                            ${type}
                        </span>
                    </div>
                    <div class='HTMLContent_container_id'>
                        <label class='HTMLContent_label_id'>
                            Id:
                        </label>
                        <span class='HTMLContent_span_id'>
                            ${id}
                        </span>
                    </div>
                    <div class="tab-wrap">

                        <input type="radio" id="tab1" name="tabGroup2" class="tab" checked>
                        <label for="tab1">Estimar Purga</label>

                        <input type="radio" id="tab2" name="tabGroup2" class="tab">
                        <label for="tab2">Consignar Purga</label>

                        <input type="radio" id="tab3" name="tabGroup2" class="tab">
                        <label for="tab3">Histórico Purgas</label>

                        <div class="tab__content">
                            <h3>Estimación de Purgas</h3>

                            <div id="first-line-estimate-purge" class="first_line_estimate_purge">
                                <div id="first-box-estimate-purge" class="first_box_estimate_purge">
                                    <label for="volumen-estimate-purge" class="label_infowindows_purge">Volumen [L]:</label>
                                    <input type="number" id="volumen-estimate-purge" class="volumen_estimate_purge" name="volumen-estimate-purge" min="0.0000001" step="any" placeholder="Introduce un valor positivo." required>
                                </div>
                                <div id="second-box-estimate-purge" class="second_box_estimate_purge">
                                    <label for="time-box-estimate-purge" class="label_infowindows_purge">Tiempo:</label>
                                    <div id="time-box-estimate-purge" class="time_box_estimate_purge" name="time-box-estimate-purge">
                                        <div class="time-group">
                                            <label for="hours-estimate-purge">Horas</label>
                                            <input type="text" id="hours-estimate-purge" class="hours-estimate-purge time-estimate-purge" name="hours-estimate-purge" placeholder="0">
                                        </div>
                                        <span class="colon">:</span>
                                        <div class="time-group">
                                            <label for="minutes-estimate-purge">Minutos</label>
                                            <input type="text" id="minutes-estimate-purge" class="minutes-estimate-purge time-estimate-purge" name="minutes-estimate-purge" placeholder="00">
                                        </div>
                                        <span class="colon">:</span>
                                        <div class="time-group">
                                            <label for="seconds-estimate-purge">Segundos</label>
                                            <input type="text" id="seconds-estimate-purge" class="seconds-estimate-purge time-estimate-purge" name="seconds-estimate-purge" placeholder="00">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="second-line-estimate-purge" class="second_line_estimate_purge">
                                <div id="third-box-estimate-purge" class="third_box_estimate_purge">
                                    <label for="start-time-estimate-purge" class="label_infowindows_purge">Hora Inicio:</label>
                                    <input type="time" id="start-time-estimate-purge" class="start_time_estimate_purge" name="start-time-estimate-purge" step="60" placeholder="HH:MM" required>
                                </div>
                                <div id="fourth-box-estimate-purge" class="fourth_box_estimate_purge">
                                    <label for="loss-coefficient-estimate-purge" class="label_infowindows_purge">Coeficiente de Pérdida [0 &#126; 1]:</label>
                                    <input type="text" id="loss-coefficient-estimate-purge" class="loss_coefficient_estimate_purge" name="loss-coefficient-estimate-purge" placeholder="Valor por defecto 0.7" required>
                                </div>
                            </div>
                            <div id="third-line-estimate-purge" class="third_line_estimate_purge">
                                <button id="button-estimate-purge-${id}" class="button_estimate_purge">Estimar</button>
                                <button id="button-clear-inputs-estimate-purge" class="button_clear_inputs_estimate_purge">Borrar</button>
                            </div>
                        </div>

                        <div class="tab__content">
                            <h3>Consignación de Purgas</h3>
                            
                            <div id="first-line-consignment-purge" class="first_line_consignment_purge">
                                <div id="first-box-consignment-purge" class="first_box_consignment_purge">
                                    <label for="time-start-consignment-purge" class="label_infowindows_purge">Fecha/Hora Inicio:</label>
                                    <input type="datetime-local" id="time-start-consignment-purge" class="time_consignment_purge" name="time-start-consignment-purge" placeholder="DD/MM/AAAA HH:MM" required>
                                </div>
                                <div id="second-box-consignment-purge" class="second_box_consignment_purge">
                                    <label for="time-end-consignment-purge" class="label_infowindows_purge">Fecha/Hora Fin:</label>
                                    <input type="datetime-local" id="time-end-consignment-purge" class="time_consignment_purge" name="time-end-consignment-purge" placeholder="DD/MM/AAAA HH:MM" required>
                                </div>
                            </div>

                            <div id="second-line-consignment-purge" class="second_line_consignment_purge">
                                <div id="third-box-consignment-purge" class="third_box_consignment_purge">
                                    <label for="volumen-consignment-purge" class="label_infowindows_purge">Volumen [L]:</label>
                                    <input type="number" id="volumen-consignment-purge" class="volumen_consignment_purge" name="volumen-consignment-purge" min="0.0000001" step="any" placeholder="Introduce un valor positivo." required>
                                </div>
                            </div>

                            <div id="third-line-consignment-purge" class="third_line_consignment_purge">
                                <button id="button-consignment-purge-${id}" class="button_consignment_purge">Consignar</button>
                                <button id="button-clear-inputs-consignment-purge" class="button_clear_inputs_consignment_purge">Borrar</button>
                            </div>

                        </div>

                        <div class="tab__content">
                            <h3>Histórico de Purgas</h3>

                            <div id="historical-table-container-node" class="historical_table_container_node">
                            </div>
                        
                        </div>

                    </div>
                </div>
            `;
        }else{
            var HTMLContent = `
                <div class='HTMLContent_container'>
                    <div class='HTMLContent_container_type'>
                        <label class='HTMLContent_label_type'>
                            Tipo:
                        </label>
                        <span class='HTMLContent_span_type'>
                            ${type}
                        </span>
                    </div>
                `;
                if (type == 'Acometida') {
                HTMLContent += `
                    <div class='HTMLContent_container_id'>
                        <label class='HTMLContent_label_id'>
                            Refcat:
                        </label>
                        <span class='HTMLContent_span_id'>
                            ${refcat}
                        </span>
                    </div>
                    `;
                }
                HTMLContent += `
                    <div class='HTMLContent_container_id'>
                        <label class='HTMLContent_label_id'>
                            Id:
                        </label>
                        <span class='HTMLContent_span_id'>
                            ${id}
                        </span>
                    </div>
                </div>
                `;
        }
        return HTMLContent
    }

    async function estimate_purge(estimatePurgeDataArray) {
        loading_start();
            try {
                const response = await fetch('/executeEstimatePurge', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ estimatePurgeDataArray: estimatePurgeDataArray })
                });
                resultEstimatePurge = await response.json();
                if (resultEstimatePurge.error) {
                    console.error('Error:', resultEstimatePurge.error);
                } else {
                    const volumenEstimatePurge = document.getElementById('volumen-estimate-purge' );

                    const lossCoefficientEstimatePurge = document.getElementById('loss-coefficient-estimate-purge' );
                    const startTimeEstimatePurge = document.getElementById('start-time-estimate-purge' );
                    const buttonEstimatePurge = document.getElementById('button-estimate-purge-'+estimatePurgeDataArray[0] );
                    if(resultEstimatePurge.tiempo){
                        document.getElementById('hours-estimate-purge').value = resultEstimatePurge.tiempo[0];
                        document.getElementById('minutes-estimate-purge').value = resultEstimatePurge.tiempo[1];
                        document.getElementById('seconds-estimate-purge').value = resultEstimatePurge.tiempo[2];
                        volumenEstimatePurge.disabled = true;
                        lossCoefficientEstimatePurge.disabled = true;
                        startTimeEstimatePurge.disabled = true;
                        buttonEstimatePurge.disabled = true;
                    }else if(resultEstimatePurge.volumen){
                        let volumen = resultEstimatePurge.volumen;
                        let formattedVolumen = parseFloat(volumen).toFixed(2);
                        document.getElementById('volumen-estimate-purge').value = formattedVolumen;
                        lossCoefficientEstimatePurge.disabled = true;
                        startTimeEstimatePurge.disabled = true;
                        buttonEstimatePurge.disabled = true;
                    }
                }
            } catch (error) {
                console.error('Error ejecutando el script:', error);
            }
        loading_end();

    }

    function popup_insert_consignment_purge(node, inputStart, inputEnd, inputVolume, caudal) {
        return new Promise((resolve, reject) => {
            Swal.fire({
                title: "¿Desea guardar los cambios?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Guardar",
                denyButtonText: `No Guardar`
            }).then(async (result) => {
                if (result.isConfirmed) {
                    currentInfowindowAnalysis.close();
                    const promises = [];
                    // Insertar consigna en la base de datos
                    promises.push(
                        insertIntoDatabaseConsignmentPurge({
                            id: node,
                            start: inputStart,
                            end: inputEnd,
                            volume: inputVolume,
                            caudal: caudal
                        })
                    );
                    Promise.all(promises)
                        .then(() => {
                            Swal.fire("Purga Consignada!", "", "success");
                            resolve(node); // Resolvemos la promesa con el objeto valve actualizado
                        })
                        .catch((error) => {
                            console.error('Error registrando cambio en la base de datos:', error);
                            reject(new Error("Error registrando cambio en la base de datos"));
                        });

                } else if (result.isDenied) {
                    Swal.fire("La purga no se ha consignado.", "", "info");
                   
                    resolve(node); // Resolvemos la promesa con el objeto valve no actualizado
                } else {
                    reject(new Error("Operación cancelada")); // Rechazamos la promesa si se cancela
                }
            }).catch((error) => {
                reject(error); // Rechazamos la promesa en caso de error
            });
        });
    }

    async function insertIntoDatabaseConsignmentPurge(data) {
        try {
            const response = await fetch(`/insertIntoDatabaseConsignmentPurge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data })
            });
    
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
    
            const resultText = await response.text();
            if (!resultText) {
                throw new Error('Respuesta del servidor vacía');
            }
    
            const result = JSON.parse(resultText);
            return result;
        } catch (error) {
            console.error('Error insertando en la base de datos:', error);
            throw error;
        }

    }
    
    function center_map_analysis() {
        const buttonCenterMapAnalysis = document.createElement('div');
        buttonCenterMapAnalysis.id = 'button-center-map-analysis';
        buttonCenterMapAnalysis.className = 'button_center_map_analysis';
        buttonCenterMapAnalysis.title = 'Centrar mapa';
        const HTMLbuttonCenterMapAnalysis = `
            <div class="button_center_map_icon_analysis"><svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512"><path d="M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/></svg>
        `;

        buttonCenterMapAnalysis.innerHTML = HTMLbuttonCenterMapAnalysis;
        myMapAnalysis.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(buttonCenterMapAnalysis);

        // Función para centrar el mapa en las coordenadas y zoom específicos
        function centerMapToCoordinatesAnalysis() {
            if (currentInfowindowAnalysis) {
                currentInfowindowAnalysis.close();
                currentInfowindowAnalysis = null;
            }
            const containerLegendMapAnalysis = document.getElementById('container-legend-map-analysis');
            if (!containerLegendMapAnalysis.classList.contains('hidden_legend_analysis')) {
                containerLegendMapAnalysis.classList.add('hidden_legend_analysis');
            }
            // Centrar el mapa en las coordenadas y establecer el zoom
            myMapAnalysis.setCenter({ lat: targetLatitude, lng: targetLongitude });
            myMapAnalysis.setZoom(targetZoom);
        }

        // Agregar evento de clic al botón para centrar el mapa
        buttonCenterMapAnalysis.addEventListener('click', centerMapToCoordinatesAnalysis);
    }

    async function paint_container_legend_map_analysis() {
        var loadingTitle = document.getElementById('loading_title');
        loadingTitle.innerHTML = 'Generando Capas...';
        const containerLegendMapAnalysis = document.createElement('div');
        containerLegendMapAnalysis.id = 'container-legend-map-analysis';
        containerLegendMapAnalysis.className = 'container_legend_map_analysis';
        containerLegendMapAnalysis.title = 'Leyenda mapa';
    
        const HTMLcontainerLegendMapAnalysis = `
            <div id="toggle-occultation-tabs-map-analysis" class="toggle_occultation_tabs_map_analysis" onclick="hide_legend_analysis()">
                <i class="fa-solid fa-chevron-right">
            </div>
            <div class="subcontainer_layers_map_analysis opacity_subcontainer_map_analysis">
                <div class="layer_list_analysis">
                    <div class="container_label_tank container_label_legend">
                        <label class="label_tank label_legend">
                            <input type="checkbox" id="toggle-tank-analysis" checked>Depósito
                        </label>
                    </div>
                    <div class="container_label_conduction container_label_legend">
                        <label class="label_conductions label_legend">
                            <input type="checkbox" id="toggle-conductions-analysis" checked>Conducciones
                        </label>
                    </div>
                    <div class="container_label_node container_label_legend">
                        <label class="label_nodes label_legend">
                            <input type="checkbox" id="toggle-nodes-analysis" checked>Nodos
                        </label>
                    </div>
                    <div class="container_label_plot container_label_legend">
                        <label class="label_plots label_legend">
                            <input type="checkbox" id="toggle-plots-analysis" checked>Parcelas
                        </label>
                    </div>
                </div>
            </div>
            <div id='subcontainer-legend-map-analysis' class="subcontainer_legend_map_analysis">
            </div>
            <div id='subcontainer-analysis-map-analysis' class="subcontainer_analysis_map_analysis">
            </div>
            <div class="subcontainer_volume_map_analysis">
            </div>
            <div id="subcontainer-historical-map-analysis" class="subcontainer_historical_map_analysis">
            </div>
            <div id="toggle-tab-layers-map-analysis" class="toggle_tab_layers_map_analysis selected_tab_map_analysis" onclick="toggleLayersTab()">Capas
            </div>
            <div id="toggle-tab-legend-map-analysis" class="toggle_tab_legend_map_analysis" onclick="toggleLegendTab()">Leyenda
            </div>
            <div id="toggle-tab-analysis-map-analysis" class="toggle_tab_analysis_map_analysis" onclick="toggleAnalysisTab()">Análisis
            </div>
            <div id="toggle-tab-volume-map-analysis" class="toggle_tab_volume_map_analysis" onclick="toggleVolumeTab()">Volumen
            </div>
            <div id="toggle-tab-historical-map-analysis" class="toggle_tab_historical_map_analysis" onclick="toggleHistoricalTab()">Histórico
            </div>
        `;
    
        containerLegendMapAnalysis.innerHTML = HTMLcontainerLegendMapAnalysis;
    
        myMapAnalysis.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(containerLegendMapAnalysis);

        const subcontainerLegend = containerLegendMapAnalysis.querySelector('.subcontainer_legend_map_analysis');
        subcontainerLegend.innerHTML = legendHTMLAnalysis;

        analysisHTMLAnalysis = `
            <div id='analysis-map-analysis' class="analysis_map_analysis">
                <label for="edad-limite">Edad Límite [h]</label>
                <input id="edad-limite" class="edad_limite_plots_infowindows_analysis" type="number" min="0" step="1" placeholder="h">
                <br>
                <label for="superacion" style="text-align: center;">Porcentaje límite<br>de superación</label>
                <select id="superacion" class="superacion_plots_infowindows_analysis">
                    <option value=""></option>
                    ${Array.from({ length: 100 }, (_, i) => `<option value="${i + 1}">${i + 1}%</option>`).join('')}
                </select>
                <br>
                <button id="show-affected-plots" onclick="show_affected_plots();" disabled>Mostrar</button>
                <br>
                <button id="clear-affected-plots" onclick="clear_affected_plots();">Limpiar</button>
            </div>
        `;

        const subcontainerAnalysis = containerLegendMapAnalysis.querySelector('.subcontainer_analysis_map_analysis');
        subcontainerAnalysis.innerHTML = analysisHTMLAnalysis;

        const selectorLimitAge = subcontainerAnalysis.querySelector('#edad-limite');
        selectorLimitAge.addEventListener('change', async function() {
            enable_disable_button_show_analysis();
        });
        // Validar la entrada para que solo permita números enteros
        selectorLimitAge.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
        const selectorSuperation = subcontainerAnalysis.querySelector('#superacion');
        selectorSuperation.addEventListener('change', async function() {
            enable_disable_button_show_analysis();
        });
        //<i class="fa-solid fa-draw-polygon"></i>
        volumeHTMLAnalysis = `
            <div class="volume_map_analysis">
                <button id="activate-selection-area" onclick="activate_selection_area();">Iniciar<br>Estimación</button>
                <button id="clear-areas" onclick="clear_areas();" disabled>Finalizar<br>Estimación</button>
                <button id="calculate-volume" onclick="calculate_volume();" disabled>Estimar<br>Volumen</button>
                <div id="box-calculate-volume-tittle" class="box_calculate_volume_tittle" disabled>
                    <p id="calculate-volume-tittle" class="calculate_volume_tittle element_calculate_volume_tittle">Volumen<br>Estimado<br>Sector [L]</p>
                    <p id="calculate-volume-valor" class="calculate_volume_valor element_calculate_volume_tittle"></p>
                </div>
            </div>
        `;

        const subcontainerVolume = containerLegendMapAnalysis.querySelector('.subcontainer_volume_map_analysis');
        subcontainerVolume.innerHTML = volumeHTMLAnalysis;

        const tankCheckboxAnalysis = containerLegendMapAnalysis.querySelector('#toggle-tank-analysis');
        tankCheckboxAnalysis.addEventListener('change', function() {
            if (this.checked) {
                paint_tank_analysis(); // Pintar el tanque si no existe
            } else {
                clear_paint_tank_analysis();
            }
        });
    
        const conductionsCheckboxAnalysis = containerLegendMapAnalysis.querySelector('#toggle-conductions-analysis');
        conductionsCheckboxAnalysis.addEventListener('change', function() {
            if (this.checked) {
                show_traffic_conductions_analysis();
            } else {
                clear_traffic_conductions_analysis();
            }
        });
    
        const nodesCheckboxAnalysis = containerLegendMapAnalysis.querySelector('#toggle-nodes-analysis');
        nodesCheckboxAnalysis.addEventListener('change', function() {
            if (this.checked) {
                show_nodes_network_analysis();
            } else {
                clear_nodes_network_analysis();
            }
        });
    
        const plotsCheckboxAnalysis = containerLegendMapAnalysis.querySelector('#toggle-plots-analysis');
        plotsCheckboxAnalysis.addEventListener('change', function() {
            if (this.checked) {
                show_plots_analysis();
            } else {
                clear_plots_analysis();
            }
        });
        layer_loading();
    }

    function enable_disable_button_show_analysis() {
        const showAffectedPlots = document.getElementById('show-affected-plots');
        // Obtener los valores de los selectores
        const edadLimite = parseInt(document.getElementById('edad-limite').value, 10);
        const superacion = parseInt(document.getElementById('superacion').value, 10);
        if (!isNaN(edadLimite) && !isNaN(superacion)) {
            showAffectedPlots.disabled = false;
        }else{
            showAffectedPlots.disabled = true;
        }
    }
    
    function toggleLayersTab() {
        const containerLegend = document.getElementById('container-legend-map-analysis');
        const subcontainerLayers = containerLegend.querySelector('.subcontainer_layers_map_analysis');
        const subcontainerLegend = containerLegend.querySelector('.subcontainer_legend_map_analysis');
        const subcontainerAnalysis = containerLegend.querySelector('.subcontainer_analysis_map_analysis');
        const subcontainerVolume = containerLegend.querySelector('.subcontainer_volume_map_analysis');
        const subcontainerHistorical = containerLegend.querySelector('.subcontainer_historical_map_analysis');

        containerLegend.style.width = '150px';
        subcontainerHistorical.style.width = '120px';

        if (!subcontainerLayers.classList.contains('opacity_subcontainer_map_analysis')) {
            subcontainerLayers.classList.add('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLegend.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLegend.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerAnalysis.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerAnalysis.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerVolume.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerVolume.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerHistorical.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerHistorical.classList.remove('opacity_subcontainer_map_analysis');
        }

        const toggleTabLayers = containerLegend.querySelector('.toggle_tab_layers_map_analysis');
        const toggleTabLegend = containerLegend.querySelector('.toggle_tab_legend_map_analysis');
        const toggleTabAnalysis = containerLegend.querySelector('.toggle_tab_analysis_map_analysis');
        const toggleTabVolume = containerLegend.querySelector('.toggle_tab_volume_map_analysis');
        const toggleTabHistorical = containerLegend.querySelector('.toggle_tab_historical_map_analysis');
        

        if(toggleTabLegend.classList.contains('selected_tab_map_analysis')){
            toggleTabLegend.classList.remove('selected_tab_map_analysis');
            toggleTabLayers.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabAnalysis.classList.contains('selected_tab_map_analysis')){
            toggleTabAnalysis.classList.remove('selected_tab_map_analysis');
            toggleTabLayers.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabVolume.classList.contains('selected_tab_map_analysis')){
            toggleTabVolume.classList.remove('selected_tab_map_analysis');
            toggleTabLayers.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabHistorical.classList.contains('selected_tab_map_analysis')){
            toggleTabHistorical.classList.remove('selected_tab_map_analysis');
            toggleTabLayers.classList.add('selected_tab_map_analysis');
        }
        delete_purges_analysis()
    }
    
    function toggleLegendTab() {
        const containerLegend = document.getElementById('container-legend-map-analysis');
        const subcontainerLayers = containerLegend.querySelector('.subcontainer_layers_map_analysis');
        const subcontainerLegend = containerLegend.querySelector('.subcontainer_legend_map_analysis');
        const subcontainerAnalysis = containerLegend.querySelector('.subcontainer_analysis_map_analysis');
        const subcontainerVolume = containerLegend.querySelector('.subcontainer_volume_map_analysis');
        const subcontainerHistorical = containerLegend.querySelector('.subcontainer_historical_map_analysis');

        containerLegend.style.width = '150px';
        subcontainerHistorical.style.width = '120px';

        if (!subcontainerLegend.classList.contains('opacity_subcontainer_map_analysis')) {
            subcontainerLegend.classList.add('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLayers.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLayers.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerAnalysis.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerAnalysis.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerVolume.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerVolume.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerHistorical.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerHistorical.classList.remove('opacity_subcontainer_map_analysis');
        }

        const toggleTabLayers = containerLegend.querySelector('.toggle_tab_layers_map_analysis');
        const toggleTabLegend = containerLegend.querySelector('.toggle_tab_legend_map_analysis');
        const toggleTabAnalysis = containerLegend.querySelector('.toggle_tab_analysis_map_analysis');
        const toggleTabVolume = containerLegend.querySelector('.toggle_tab_volume_map_analysis');
        const toggleTabHistorical = containerLegend.querySelector('.toggle_tab_historical_map_analysis');

        if(toggleTabLayers.classList.contains('selected_tab_map_analysis')){
            toggleTabLayers.classList.remove('selected_tab_map_analysis');
            toggleTabLegend.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabAnalysis.classList.contains('selected_tab_map_analysis')){
            toggleTabAnalysis.classList.remove('selected_tab_map_analysis');
            toggleTabLegend.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabVolume.classList.contains('selected_tab_map_analysis')){
            toggleTabVolume.classList.remove('selected_tab_map_analysis');
            toggleTabLegend.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabHistorical.classList.contains('selected_tab_map_analysis')){
            toggleTabHistorical.classList.remove('selected_tab_map_analysis');
            toggleTabLegend.classList.add('selected_tab_map_analysis');
        }
        delete_purges_analysis()
    }
    
    function toggleAnalysisTab() {
        const containerLegend = document.getElementById('container-legend-map-analysis');
        containerLegend.style.width = '150px';
        const subcontainerLayers = containerLegend.querySelector('.subcontainer_layers_map_analysis');
        const subcontainerLegend = containerLegend.querySelector('.subcontainer_legend_map_analysis');
        const subcontainerAnalysis = containerLegend.querySelector('.subcontainer_analysis_map_analysis');
        const subcontainerVolume = containerLegend.querySelector('.subcontainer_volume_map_analysis');
        const subcontainerHistorical = containerLegend.querySelector('.subcontainer_historical_map_analysis');

        if (!subcontainerAnalysis.classList.contains('opacity_subcontainer_map_analysis')) {
            subcontainerAnalysis.classList.add('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLayers.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLayers.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLegend.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLegend.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerVolume.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerVolume.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerHistorical.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerHistorical.classList.remove('opacity_subcontainer_map_analysis');
        }

        const toggleTabLayers = containerLegend.querySelector('.toggle_tab_layers_map_analysis');
        const toggleTabLegend = containerLegend.querySelector('.toggle_tab_legend_map_analysis');
        const toggleTabAnalysis = containerLegend.querySelector('.toggle_tab_analysis_map_analysis');
        const toggleTabVolume = containerLegend.querySelector('.toggle_tab_volume_map_analysis');
        const toggleTabHistorical = containerLegend.querySelector('.toggle_tab_historical_map_analysis');

        if(toggleTabLayers.classList.contains('selected_tab_map_analysis')){
            toggleTabLayers.classList.remove('selected_tab_map_analysis');
            toggleTabAnalysis.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabLegend.classList.contains('selected_tab_map_analysis')){
            toggleTabLegend.classList.remove('selected_tab_map_analysis');
            toggleTabAnalysis.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabVolume.classList.contains('selected_tab_map_analysis')){
            toggleTabVolume.classList.remove('selected_tab_map_analysis');
            toggleTabAnalysis.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabHistorical.classList.contains('selected_tab_map_analysis')){
            toggleTabHistorical.classList.remove('selected_tab_map_analysis');
            toggleTabAnalysis.classList.add('selected_tab_map_analysis');
        }
        delete_purges_analysis()
    }

    function toggleVolumeTab() {
        const containerLegend = document.getElementById('container-legend-map-analysis');
        containerLegend.style.width = '150px';
        const subcontainerLayers = containerLegend.querySelector('.subcontainer_layers_map_analysis');
        const subcontainerLegend = containerLegend.querySelector('.subcontainer_legend_map_analysis');
        const subcontainerAnalysis = containerLegend.querySelector('.subcontainer_analysis_map_analysis');
        const subcontainerVolume = containerLegend.querySelector('.subcontainer_volume_map_analysis');
        const subcontainerHistorical = containerLegend.querySelector('.subcontainer_historical_map_analysis');

        if (!subcontainerVolume.classList.contains('opacity_subcontainer_map_analysis')) {
            subcontainerVolume.classList.add('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLayers.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLayers.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLegend.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLegend.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerAnalysis.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerAnalysis.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerHistorical.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerHistorical.classList.remove('opacity_subcontainer_map_analysis');
        }

        const toggleTabLayers = containerLegend.querySelector('.toggle_tab_layers_map_analysis');
        const toggleTabLegend = containerLegend.querySelector('.toggle_tab_legend_map_analysis');
        const toggleTabAnalysis = containerLegend.querySelector('.toggle_tab_analysis_map_analysis');
        const toggleTabVolume = containerLegend.querySelector('.toggle_tab_volume_map_analysis');
        const toggleTabHistorical = containerLegend.querySelector('.toggle_tab_historical_map_analysis');

        if(toggleTabLayers.classList.contains('selected_tab_map_analysis')){
            toggleTabLayers.classList.remove('selected_tab_map_analysis');
            toggleTabVolume.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabLegend.classList.contains('selected_tab_map_analysis')){
            toggleTabLegend.classList.remove('selected_tab_map_analysis');
            toggleTabVolume.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabAnalysis.classList.contains('selected_tab_map_analysis')){
            toggleTabAnalysis.classList.remove('selected_tab_map_analysis');
            toggleTabVolume.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabHistorical.classList.contains('selected_tab_map_analysis')){
            toggleTabHistorical.classList.remove('selected_tab_map_analysis');
            toggleTabVolume.classList.add('selected_tab_map_analysis');
        }
        delete_purges_analysis()
    }

    function toggleHistoricalTab() {
        const containerLegend = document.getElementById('container-legend-map-analysis');
        const subcontainerLayers = containerLegend.querySelector('.subcontainer_layers_map_analysis');
        const subcontainerLegend = containerLegend.querySelector('.subcontainer_legend_map_analysis');
        const subcontainerAnalysis = containerLegend.querySelector('.subcontainer_analysis_map_analysis');
        const subcontainerVolume = containerLegend.querySelector('.subcontainer_volume_map_analysis');
        const subcontainerHistorical = containerLegend.querySelector('.subcontainer_historical_map_analysis');

        containerLegend.style.width = '350px';
        subcontainerHistorical.style.width = '320px';

        if (!subcontainerHistorical.classList.contains('opacity_subcontainer_map_analysis')) {
            subcontainerHistorical.classList.add('opacity_subcontainer_map_analysis');
        }
        if(subcontainerVolume.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerVolume.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLayers.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLayers.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerLegend.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerLegend.classList.remove('opacity_subcontainer_map_analysis');
        }
        if(subcontainerAnalysis.classList.contains('opacity_subcontainer_map_analysis')){
            subcontainerAnalysis.classList.remove('opacity_subcontainer_map_analysis');
        }

        const toggleTabLayers = containerLegend.querySelector('.toggle_tab_layers_map_analysis');
        const toggleTabLegend = containerLegend.querySelector('.toggle_tab_legend_map_analysis');
        const toggleTabAnalysis = containerLegend.querySelector('.toggle_tab_analysis_map_analysis');
        const toggleTabVolume = containerLegend.querySelector('.toggle_tab_volume_map_analysis');
        const toggleTabHistorical = containerLegend.querySelector('.toggle_tab_historical_map_analysis');


        if(toggleTabLayers.classList.contains('selected_tab_map_analysis')){
            toggleTabLayers.classList.remove('selected_tab_map_analysis');
            toggleTabHistorical.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabLegend.classList.contains('selected_tab_map_analysis')){
            toggleTabLegend.classList.remove('selected_tab_map_analysis');
            toggleTabHistorical.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabAnalysis.classList.contains('selected_tab_map_analysis')){
            toggleTabAnalysis.classList.remove('selected_tab_map_analysis');
            toggleTabHistorical.classList.add('selected_tab_map_analysis');
        }
        if(toggleTabVolume.classList.contains('selected_tab_map_analysis')){
            toggleTabVolume.classList.remove('selected_tab_map_analysis');
            toggleTabHistorical.classList.add('selected_tab_map_analysis');
        }
        draw_purges_analysis();
    }
    
    function hide_legend_analysis(){
        toggleLayersTab();
        const containerLegendMapAnalysis = document.getElementById('container-legend-map-analysis');
        const toggleTabI = document.getElementById('toggle-tab-i');
        if (containerLegendMapAnalysis.classList.contains('hidden_legend_analysis')) {
            containerLegendMapAnalysis.classList.remove('hidden_legend_analysis');
            toggleTabI.classList.remove('fa-chevron-left');
        } else {
            containerLegendMapAnalysis.classList.add('hidden_legend_analysis');
            toggleTabI.classList.add('fa-chevron-left');
        }
    };

    function activate_selection_area() {
        const activateSelectionArea = document.getElementById('activate-selection-area');
        activateSelectionArea.disabled = true;
        const clearAreas = document.getElementById('clear-areas');
        clearAreas.disabled = false;
        recalculateConductions();
        drawingManager.setOptions({
            drawingControl: true,
            drawingMode: google.maps.drawing.OverlayType.POLYGON
        });
    }

    function clear_areas() {
        const activateSelectionArea = document.getElementById('activate-selection-area');
        activateSelectionArea.disabled = false;
        const clearAreas = document.getElementById('clear-areas');
        clearAreas.disabled = true;
        const calculateVolume = document.getElementById('calculate-volume');
        calculateVolume.disabled = true;
        drawingManager.setOptions({
            drawingControl: false,
            drawingMode: null,
        });
        for (let shape of drawnShapes) {
            shape.setMap(null);
        }
        drawnShapes = [];
        
        for (let marker of deleteMarkers) {
            marker.setMap(null); // Eliminar el marcador del mapa
        }
        deleteMarkers = []; // Limpiar el array de marcadores
        let boxCalculateVolumeValor = document.getElementById('box-calculate-volume-tittle');
        boxCalculateVolumeValor.style.opacity = '0';
        let calculateVolumeValor = document.getElementById('calculate-volume-valor');
        calculateVolumeValor.innerHTML = '';
    
        repainted_traffic_conductions_analysis();
    }

    function addDeleteMarker(shape) {
        let position;

        if (shape.getBounds) {
            // Para rectángulos
            const bounds = shape.getBounds();
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();
            const southCenter = {
                lat: southWest.lat(),
                lng: (northEast.lng() + southWest.lng()) / 2
            };
            position = southCenter;
        } else if (shape.getPath) {
            // Para polígonos
            const path = shape.getPath().getArray();
            let latMin = path[0].lat();
            let lngSum = 0;
    
            path.forEach(coord => {
                if (coord.lat() < latMin) {
                    latMin = coord.lat();
                }
                lngSum += coord.lng();
            });
    
            const lngCenter = lngSum / path.length;
            position = { lat: latMin, lng: lngCenter };
        } else if (shape.getCenter) {
            // Para círculos
            const center = shape.getCenter();
            const radius = shape.getRadius();
            position = {
                lat: center.lat() - (radius / 111320), // Aproximación de la latitud con el radio
                lng: center.lng()
            };
        }

        const deleteMarker = new google.maps.Marker({
            position: position,
            map: myMapAnalysis,
            icon: {
                url: "https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/action/svg/production/ic_delete_48px.svg",
                scaledSize: new google.maps.Size(20, 20),
                anchor: new google.maps.Point(10, 10),
                opacity: 0.7
            }
        });
    
        google.maps.event.addListener(deleteMarker, 'mouseover', function() {
            deleteMarker.setIcon({
                url: "https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/action/svg/production/ic_delete_48px.svg",
                scaledSize: new google.maps.Size(25, 25),
                anchor: new google.maps.Point(12.5, 12.5),
                opacity: 1
            });
        });
    
        google.maps.event.addListener(deleteMarker, 'mouseout', function() {
            deleteMarker.setIcon({
                url: "https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/action/svg/production/ic_delete_48px.svg",
                scaledSize: new google.maps.Size(20, 20),
                anchor: new google.maps.Point(10, 10),
                opacity: 0.7
            });
        });
    
        google.maps.event.addListener(deleteMarker, 'click', function() {
            shape.setMap(null);
            deleteMarker.setMap(null);
            drawnShapes = drawnShapes.filter(item => item !== shape);
            deleteMarkers = deleteMarkers.filter(marker => marker !== deleteMarker);
            recalculateConductions();
        });
        deleteMarkers.push(deleteMarker);
    }

    function recalculateConductions() {
        if(drawnShapes.length > 0){
            const calculateVolume = document.getElementById('calculate-volume');
            calculateVolume.disabled = false;
        }else{
            const calculateVolume = document.getElementById('calculate-volume');
            calculateVolume.disabled = true;
        }
        trafficSelectedConductionsArrayAnalysis = [];
        trafficConductionsArrayAnalysis.forEach(polyline => {
            const path = polyline.getPath().getArray();
            let isInsideAnyShape = false;
    
            for (const shape of drawnShapes) {
                if (isPathInsideShape(path, shape)) {
                    isInsideAnyShape = true;
                    trafficSelectedConductionsArrayAnalysis.push(polyline.id);
                    break;
                }
            }
    
            polyline.setOptions({
                strokeColor: isInsideAnyShape ? 'red' : 'black'
            });
        });
        console.log(trafficSelectedConductionsArrayAnalysis);
    }

    function isPathInsideShape(path, shape) {
        if (shape instanceof google.maps.Rectangle) {
            const bounds = shape.getBounds();
            return path.every(coord => bounds.contains(coord));
        } else if (shape instanceof google.maps.Polygon) {
            const polygon = new google.maps.Polygon({ paths: shape.getPath() });
            return path.every(coord => google.maps.geometry.poly.containsLocation(coord, polygon));
        } else if (shape instanceof google.maps.Circle) {
            const center = shape.getCenter();
            const radius = shape.getRadius();
            return path.every(coord => google.maps.geometry.spherical.computeDistanceBetween(coord, center) <= radius);
        }
        return false;
    }

// Fin funciones comunes

// Inicio funcion cálculo de volumen

    async function calculate_volume() {
        var loadingTitle = document.getElementById('loading_title');
        loadingTitle.innerHTML = 'Estimando Volumen...';
        loading_start();

            try {
                const response = await fetch('/executeCalculateVolume', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ conductionsSelected: trafficSelectedConductionsArrayAnalysis })
                });
                resultCalculateVolume = await response.json();
                if (resultCalculateVolume.error) {
                    console.error('Error:', resultCalculateVolume.error);
                } else {
                    console.log(resultCalculateVolume);
                    let boxCalculateVolumeValor = document.getElementById('box-calculate-volume-tittle');
                    boxCalculateVolumeValor.style.opacity = '1';
                    let calculateVolumeValor = document.getElementById('calculate-volume-valor');
                    let volumen = resultCalculateVolume.volumen;
                    let formattedVolumen = parseFloat(volumen).toFixed(2);
                    calculateVolumeValor.innerHTML = formattedVolumen;
                }
            } catch (error) {
                console.error('Error ejecutando el script:', error);
            }
        loading_end();
    }

// Fin funcion cálculo de volumen

// Inicio función extracción de datos para cáculo de superación

async function show_affected_plots(){
    const edadLimite = parseInt(document.getElementById('edad-limite').value, 10);

    
    let ShowAffectedPlots = await fetch(
        `/getShowAffectedPlots`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ edadLimite: edadLimite }),
        }
    );
    if (ShowAffectedPlots.ok) {
        
        dataShowAffectedPlots = await ShowAffectedPlots.json();
        // Transformar la estructura de `rows` para que el `id` sea el índice
        const dataShowAffectedPlotsIndexada = {};
        dataShowAffectedPlots.data.rows.forEach(row => {
            dataShowAffectedPlotsIndexada[row.id] = row.valor;
        });
        paint_affected_plots_analysis(dataShowAffectedPlotsIndexada);
    } else {
        console.error('Error al extraer los datos del servidor');
    }
}

function clear_affected_plots(){
    plotsArrayAnalysis.forEach(plot => {
        color = get_color_for_cota_analysis(dataShowAffectedPlotsIndexada[plot.id].edad);
        plot.setOptions({
            strokeColor: color,
            fillColor: color,
        });
    });
    // Restablecer los selectores a la posición inicial
    const edadLimite = document.getElementById('edad-limite');
    edadLimite.value = '';
    document.getElementById('superacion').selectedIndex = 0;
    const subcontainerLegend = document.getElementById('subcontainer-legend-map-analysis');
    subcontainerLegend.innerHTML = legendHTMLAnalysis;
    const showAffectedPlots = document.getElementById('show-affected-plots');
    showAffectedPlots.disabled = true;
}

// Fin función extracción de datos para cáculo de superación

// Inicio funciones popup gráfica de parcelas

    // Extracción de datos
    async function historical_extractions_analysis(id, edad){
        let historicalExtractionCoor = await fetch(
            `/getHistoricalData`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ table: 'graficas_edad_coor', id: id }),
            }
        );
        if (historicalExtractionCoor.ok) {
            
            dateHistoricalExtractionCoor = await historicalExtractionCoor.json();
            let historicalExtractionParametros = await fetch(
                `/getHistoricalData`,
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ table: 'graficas_edad_parametros', id: id }),
                }
            );
            if (historicalExtractionParametros.ok) {
                
                const dateHistoricalExtractionParametros = await historicalExtractionParametros.json();
                generate_chart_analysis(dateHistoricalExtractionCoor, dateHistoricalExtractionParametros, edad);
                
                
            } else {
                console.error('Error al extraer los datos del servidor');
            }
        } else {
            console.error('Error al extraer los datos del servidor');
        }
    }

    function generate_chart_analysis(dataCoor, dataParametros, edad) {
        // Verificar que data tenga la estructura esperada
        if (!dataCoor.success || !dataCoor.data || !dataCoor.data.rows) {
            console.error('Estructura de datos incorrecta', dataCoor);
            return;
        }
    
        // Extraer los valores de data.rows
        const dataEdadCoor = dataCoor.data.rows[0];
        
        // Ordenar el objeto por claves (edades)
        const sortedData = Object.keys(dataEdadCoor)
        .filter(key => !isNaN(key) && !isNaN(dataEdadCoor[key])) // Filtrar valores numéricos
        .sort((a, b) => parseFloat(a) - parseFloat(b)) // Ordenar por edad (clave)
        .map(key => {
            return {
            x: parseFloat(dataEdadCoor[key]), // Usar el valor para el eje y (superación) 
            y: parseFloat(key), // Usar la clave para el eje x (edad)
            };
        });

        // Obtener los valores de los selectores
        const edadLimite = parseInt(document.getElementById('edad-limite').value, 10);
        const superacion = parseInt(document.getElementById('superacion').value, 10);
        let maxX;
        // Configuración básica de la gráfica
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
        
          // Configuración básica de la gráfica
          const chartConfig = {
            chart: {
                zooming: {
                    type: 'x'
                },
                events: {
                    load: function () {
                        // Obtener el valor máximo del eje X
                        const xAxis = this.xAxis[0];
                        maxX = xAxis.getExtremes().max;
                            
                        if(edadLimite > maxX){
                            maxX = edadLimite;
                        }
                        // Verificación de edadLimite y superacion
                        if (!isNaN(edadLimite) && !isNaN(superacion)) {
                            // Agregar series adicionales si edadLimite y superacion son válidos
                            this.addSeries({
                                type: 'scatter',
                                name: 'Punto de Referencia',
                                data: [{
                                    x: edadLimite,
                                    y: superacion
                                }],
                                marker: {
                                    symbol: 'circle',
                                    radius: 5,
                                    fillColor: 'red'
                                },
                                tooltip: {
                                    pointFormatter: function () {
                                    return `Edad Límite: <b>${this.x}</b><br/>Superación: <b>${this.y}%</b><br/>`;
                                    }
                                }
                            });

                            this.addSeries({
                                type: 'area',
                                name: '',
                                data: [
                                    { x: edadLimite, y: superacion },
                                    { x: maxX, y: superacion }, // Línea horizontal hasta el final de la escala de edad (maxXValue)
                                    { x: maxX, y: 100 }, // Línea vertical hasta el 100% de superación
                                    { x: edadLimite, y: 100 }, // Línea horizontal de vuelta a la edad limite
                                    { x: edadLimite, y: superacion } // Cerrar el área
                                ],
                                fillColor: 'rgba(255, 0, 0, 0.5)', // Rojo con opacidad 0.5
                                enableMouseTracking: false,
                                showInLegend: false
                            });

                            this.addSeries({
                                type: 'line',
                                name: '',
                                data: [
                                    { x: edadLimite, y: superacion },
                                    { x: maxX, y: superacion } // Línea horizontal hasta el final de la escala de edad (maxX)
                                ],
                                color: 'red',
                                dashStyle: 'ShortDash'
                            });

                            this.addSeries({
                                type: 'line',
                                name: '',
                                data: [
                                    { x: edadLimite, y: superacion },
                                    { x: edadLimite, y: 100 } // Línea vertical hasta el 100% de superación
                                ],
                                color: 'red',
                                dashStyle: 'ShortDash'
                            });
                        }
                    }
                }
            },
            title: {
              text: 'Gráfica de Relación Consumo - Edad del Agua'
            },
            credits: {
              enabled: false
            },
            subtitle: {
              text: document.ontouchstart === undefined ?
                'Haga clic y arrastre en el gráfico para acercar e inspeccionar los datos.' :
                'Pellizque el gráfico para acercarlo',
              align: 'center'
            },
            xAxis: {
              title: {
                text: 'Edad del agua [h]'
              },
              labels: {
                formatter: function () {
                  return this.value; // Agregar '[h]' a los valores del eje x
                }
              }
            },
            yAxis: {
              title: {
                text: 'Porcentaje de Consumo que Supera Edad'
              },
              labels: {
                formatter: function () {
                  return this.value + '%'; // Agregar '%' a los valores del eje y
                }
              },
              min: 0, // Valor mínimo de la escala y
              max: 100 // Valor máximo de la escala y
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
            tooltip: {
                shared: false, // No compartir el tooltip entre las series
                headerFormat: '', // Eliminar la cabecera por defecto
                formatter: function () {
                  return `Edad Límite: <b>${this.x.toFixed(4)} [h]</b><br/>Superación: <b>${this.y}%</b><br/>`;
                }
              },
            series: [
              {
                type: 'area',
                name: '',
                data: sortedData, // Usar los datos ordenados
              }
            ]
          };


        // Generar el gráfico usando Highcharts
        const chart = Highcharts.chart('chartContainer', chartConfig);

        // Fin generación de gráfica

        // Inicio pintar parámetros
        let contentParametersHTML=`
            <div class='HTMLContent_container_analysis'>
                <label class='HTMLContent_title_type_analysis'>
                    PARÁMETROS
                </label>
                <div class='HTMLContent_container_type_analysis'>
                    <label class='HTMLContent_label_type_analysis'>
                        Media [h]:
                    </label>
                    <span class='HTMLContent_span_type_analysis'>
                        ${parseFloat(dataParametros.data.rows[0].media).toFixed(4)}
                    </span>
                </div>
                <div class='HTMLContent_container_type_analysis'>
                    <label class='HTMLContent_label_type_analysis'>
                        Varianza [h<sup>2</sup>]:
                    </label>
                    <span class='HTMLContent_span_type_analysis'>
                        ${parseFloat(dataParametros.data.rows[0].varianza).toFixed(4)}
                    </span>
                </div>
                <div class='HTMLContent_container_type_analysis'>
                    <label class='HTMLContent_label_type_analysis'>
                        &#945; []:
                    </label>
                    <span class='HTMLContent_span_type_analysis'>
                        ${parseFloat(dataParametros.data.rows[0].alfa).toFixed(4)}
                    </span>
                </div>
                <div class='HTMLContent_container_type_analysis'>
                    <label class='HTMLContent_label_type'>
                        &#952; [h]:
                    </label>
                    <span class='HTMLContent_span_type_analysis'>
                        ${parseFloat(dataParametros.data.rows[0].theta).toFixed(4)}
                    </span>
                </div>
                <div class='HTMLContent_container_type_analysis'>
                    <label class='HTMLContent_label_type'>
                        Edad actual [h]:
                    </label>
                    <span class='HTMLContent_span_type_analysis'>
                        ${edad}
                    </span>
                </div>
            </div>
        `;
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = contentParametersHTML;
        // Fin pintar parámetros

        openPopupElement();
    }
    

// Fin funciones popup gráfica de parcelas

// Inicio tablas del histórico de purgas

    async function loadHistoricalDataPurge() {
        try {
            const response = await fetch(`/loadHistoricalDataPurge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const resultText = await response.text();
            if (!resultText) {
                throw new Error('Respuesta del servidor vacía');
            }

            arrayHistoricalPurge = JSON.parse(resultText);
            createHistoricalTablePurge(false);
        } catch (error) {
            console.error('Error al extraer de la base de datos:', error);
            throw error;
        }
    }

    function createHistoricalTablePurge(node) {
        console.log('arrayHistoricalPurge:');
        console.log(arrayHistoricalPurge)
        
        
        // Crear la tabla y el encabezado
        const table = document.createElement('table');
        table.classList.add('historical-table-purge');
        
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const headers = ['ID Nodo', 'Fecha Inicio', 'Fecha Fin', 'Volumen Purgas<br>[L]', 'Caudal Purgas<br>[L/s]'];
        headers.forEach((headerText, index) => {
            console.log(headerText);
            const th = document.createElement('th');
            th.innerHTML = headerText.replace(' ', '<br>'); // Agrega un salto de línea para las situaciones
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Crear el cuerpo de la tabla
        const tbody = document.createElement('tbody');
        
        arrayHistoricalPurge.forEach(item => {
            if(node){
                if(item.id === node){
                    paint_row(item);
                }
            }else{
                paint_row(item);
            }
        });

        function paint_row(item){
            const row = document.createElement('tr');
            
            const cellId = document.createElement('td');
            cellId.textContent = item.id;
            cellId.style.cursor = 'pointer';
            cellId.style.textAlign = 'center';
            cellId.id = 'cellId' + item.id;
            cellId.addEventListener('click', () => {
                const node = nodeNetworkArrayAnalysis.find(node => node.id === item.id);
                if (node) {
                    local = false;
                    myMapAnalysis.setZoom(18);
                    myMapAnalysis.panTo(node.position);
                    google.maps.event.trigger(node, 'click');
                    if(!local)
                        setTimeout(() => {
                            const tab1 = document.getElementById('tab1');
                            const tab2 = document.getElementById('tab2');
                            const tab3 = document.getElementById('tab3');

                            // Marca la tercera pestaña como activa
                            if (tab3) {
                                tab1.checked = false;
                                tab2.checked = false;
                                tab3.checked = true;
                            } else {
                                console.error('No se encontraron las pestañas en el infowindow.');
                            }
                            local = true;
                        }, 500); // Ajusta el tiempo si es necesario para que coincida con la carga del contenido
                } else {
                    console.error(`No se encontró el nodo con id ${item.id}`);
                }
            });
            row.appendChild(cellId);
            
            const cellStartDate = document.createElement('td');
            const startDate = new Date(item.start_date);
            const formattedStartDate = startDate.toLocaleDateString();
            const formattedStartTime = startDate.toLocaleTimeString();
            cellStartDate.innerHTML = `${formattedStartDate}<br>${formattedStartTime}`;
            row.appendChild(cellStartDate);
    
            const cellEndDate = document.createElement('td');
            const endDate = new Date(item.end_date);
            const formattedEndDate = endDate.toLocaleDateString();
            const formattedEndTime = endDate.toLocaleTimeString();
            cellEndDate.innerHTML = `${formattedEndDate}<br>${formattedEndTime}`;
            row.appendChild(cellEndDate);
            
            const cellVolume = document.createElement('td');
            const volumeValue = item.volume;
            cellVolume.textContent = volumeValue.toFixed(2)
            row.appendChild(cellVolume);
    
            const cellFlow = document.createElement('td');
            const flowValue = item.flow;
            cellFlow.textContent = flowValue.toFixed(4);
            row.appendChild(cellFlow);
            
            tbody.appendChild(row);
        }
        
        table.appendChild(tbody);
        
        

        // Añadir el botón al contenedor sin sobrescribir el contenido
        if(node){
            return table;
        }else{
            const container = document.getElementById('subcontainer-historical-map-analysis');
            // Vaciar el contenedor antes de añadir la nueva tabla
            container.innerHTML = '';
            
            container.appendChild(table);
            const globalHistoryButton = document.createElement('div');
            globalHistoryButton.id = 'export-history-button';
            globalHistoryButton.className = 'export_history_button';
            globalHistoryButton.innerHTML = `<img width="25" height="25" class="drop" src="/images/icons/export-to-excel.png"/>`;

            // Añadir evento click al botón de exportar
            globalHistoryButton.addEventListener('click', () => {
                exportHistoricalPurges();
            });
            container.appendChild(globalHistoryButton);
        }
        
    }

// Fin tablas del histórico de purgas

// Inicio exportar dato a Excel

function exportHistoricalPurges(){
    // Asegurarse de que haya datos en el array
    if (!arrayHistoricalPurge || arrayHistoricalPurge.length === 0) {
        console.error('No hay datos disponibles para exportar');
        return;
    }

    // Crear una nueva hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(arrayHistoricalPurge.map(purge => ({
        ID: purge.id,
        "Fecha Inicio": purge.start_date,
        "Fecha Fin": purge.end_date,
        "Volumen Purgas [L]": purge.volume,
        "Caudal Purgas [L/s]": purge.flow
    })));

    // Crear un nuevo libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico Purgas");

    // Generar el archivo Excel y disparar la descarga
    XLSX.writeFile(workbook, 'historico_purgas.xlsx');
}

// Fin exportar datos a Excel