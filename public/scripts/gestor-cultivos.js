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


document.addEventListener('DOMContentLoaded', function () {

  const historicalData = [
    { month: 'Enero', type: 'Pimiento' },
    { month: 'Febrero', type: 'SIN RIEGO' },
    { month: 'Marzo', type: 'Almendros' },
    { month: 'Abril', type: 'Vid' },
    { month: 'Mayo', type: 'Cebolla' },
    { month: 'Junio', type: 'Pimiento' },
    { month: 'Julio', type: 'Ajos' },
    { month: 'Agosto', type: 'Arboles' },
    { month: 'Septiembre', type: 'Melón' },
    { month: 'Octubre', type: 'Guisantes' },
    { month: 'Noviembre', type: 'Huerta' },
    { month: 'Diciembre', type: 'Pimiento' }
  ];

  const months = historicalData.map(data => data.month);
  const types = historicalData.map(data => data.type);

  const historicalChart = Highcharts.chart('historicalChart', {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Histórico de Tipos de Cultivos en 2024'
    },
    xAxis: {
      categories: months,
      title: {
        text: 'Meses'
      }
    },
    yAxis: {
      title: {
        text: 'Tipos de Cultivo'
      },
      visible: false
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Tipo de Cultivo',
      data: types.map((type, index) => ({ y: index + 1, name: type })),
      dataLabels: {
        enabled: true,
        formatter: function () {
          return this.point.name;
        }
      }
    }],
    credits: {
      enabled: false
    }
  });


  const rows = document.querySelectorAll('.selectable-row');
  const cultivoInfo = document.getElementById('cultivoInfo');
  const hectareasInfo = document.getElementById('hectareasInfo');

  function updateCard(row) {
    const id = row.getAttribute('data-uid');
    const parcela = window.parcelas.find(p => p.id === id);

    if (parcela) {
      cultivoInfo.textContent = `Cultivo: ${parcela.cultivo}`;
      hectareasInfo.textContent = `Hectáreas: ${parcela.hectareas}`;
    } else {
      cultivoInfo.textContent = 'Cultivo: N/A';
      hectareasInfo.textContent = 'Hectáreas: N/A';
    }
  }

  function selectRow(row) {
    rows.forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    updateCard(row);
    fetchCultivos(row);
  }

  // Selecciona la primera fila por defecto
  if (rows.length > 0) {
    selectRow(rows[0]);
  }

  // Agrega evento de clic a las filas
  rows.forEach(row => {
    row.addEventListener('click', function () {
      selectRow(row);
    });
  });

  async function fetchCultivos(row) {

    const idParcela = row.getAttribute('data-uid');
    console.log("getDataCultivo params:",idParcela);
    const response = await fetch(`/gestor-cultivos/getCultivos?idParcela=${idParcela}`);
    const cultivos = await response.json();
    console.log("getDataCultivo response:", JSON.stringify(cultivos));

    updateCultivosTable(cultivos);
    rebuildChart(cultivos);
  }

  function updateCultivosTable(cultivos) {
    console.log("updateCultivosTable " + cultivos);
    const cultivosTableBody = document.getElementById('cultivosTableBody');
    cultivosTableBody.innerHTML = '';
    cultivos.forEach(cultivo => {
      const row = document.createElement('tr');
      row.innerHTML = `
              <td>${cultivo.idParcela}</td>
              <td>${cultivo.cultivo}</td>
              <td>${cultivo.fechayhora}</td>
          `;
      cultivosTableBody.appendChild(row);
    });
  }

  function rebuildChart(cultivos) {
    const fechas = cultivos.map(cultivo => cultivo.fechayhora);
    const tipos = cultivos.map(cultivo => cultivo.cultivo);

    historicalChart.update({
        xAxis: {
            categories: fechas
        },
        series: [{
            name: 'Tipo de Cultivo',
            data: tipos.map((type, index) => ({ y: index + 1, name: type })),
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.point.name;
                }
            }
        }]
    });
}


});
