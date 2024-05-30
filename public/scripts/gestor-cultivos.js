document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tab-content');
  const tabLabels = document.querySelectorAll('.tab-label');
  const subTabButtons = document.querySelectorAll('.campo-tab-button');
  const subTabContents = document.querySelectorAll('.campo-tab-content');
  const rows = document.querySelectorAll('.selectable-row');
  const cultivoInfo = document.getElementById('cultivoInfo');
  const hectareasInfo = document.getElementById('hectareasInfo');
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.close-btn');
  const editButton = document.getElementById('edit-button');

  let selectedParcelaId = null;

  // Función para mostrar la pestaña seleccionada
  function showTab(tabId) {
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    tabLabels.forEach(label => label.classList.remove('active'));
    const activeLabel = document.querySelector(`.tab-label[data-tab="${tabId}"]`);
    activeLabel.classList.add('active');
  }

  // Función para mostrar la subpestaña seleccionada
  function showSubTab(tabId) {
    subTabButtons.forEach(button => {
      if (button.getAttribute('data-tab') === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

    subTabContents.forEach(content => {
      if (content.id === tabId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  // Función para abrir el modal
  function openModal() {
    if (selectedParcelaId) {
      modal.style.display = 'block';

      const addBtn = document.querySelector('.modal-add-btn');
      const cancelBtn = document.querySelector('.modal-cancel-btn');
      const cultivoSelect = document.getElementById('cultivoSelect');

      addBtn.onclick = function () {
        const selectedCultivo = cultivoSelect.value;
        if (selectedCultivo) {
          fetch(`/gestor-cultivos/agregarCultivo?idParcela=${selectedParcelaId}&idcultivo=${selectedCultivo}`, {
            method: 'POST',
          })
            .then(response => response.json())
            .then(data => {
              console.log('Cultivo agregado:', data);
              modal.style.display = 'none';
              // Aquí puedes actualizar la interfaz de usuario o realizar otras acciones
              fetchCultivos(selectedParcelaId); // Actualizar la tabla de cultivos
            })
            .catch(error => console.error('Error:', error));
        }
      };

      cancelBtn.onclick = function () {
        modal.style.display = 'none';
      };

      closeBtn.onclick = function () {
        modal.style.display = 'none';
      };

      window.onclick = function (event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      };
    } else {
      alert('Seleccione una parcela primero.');
    }
  }

  // Mostrar la primera pestaña y subpestaña por defecto
  showTab('cultivos');
  showSubTab('datos');

  // Añadir evento de clic a las etiquetas de pestañas
  tabLabels.forEach(label => {
    label.addEventListener('click', () => {
      const tabId = label.getAttribute('data-tab');
      showTab(tabId);
    });
  });

  // Añadir evento de clic a los botones de subpestañas
  subTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      showSubTab(tabId);
    });
  });

  // Función para actualizar la tarjeta de detalles del cultivo
  function updateCard(row) {
    const id = row.getAttribute('data-uid');
    const parcela = window.parcelas.find(p => p.id === id);

    if (parcela) {
      selectedParcelaId = id;
      cultivoInfo.textContent = `Cultivo: ${parcela.cultivo}`;
      hectareasInfo.innerHTML = `Hectáreas: ${parcela.hectareas}`;
    } else {
      selectedParcelaId = null;
      cultivoInfo.textContent = 'Cultivo: N/A';
      hectareasInfo.innerHTML = 'Hectáreas: N/A';
    }
  }

  // Función para seleccionar una fila y actualizar la tarjeta
  function selectRow(row) {
    rows.forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    updateCard(row);
    fetchCultivos(row);
  }

  // Seleccionar la primera fila por defecto
  if (rows.length > 0) {
    selectRow(rows[0]);
  }

  // Añadir evento de clic a las filas
  rows.forEach(row => {
    row.addEventListener('click', function () {
      selectRow(row);
    });
  });

  // Función para obtener cultivos de la parcela seleccionada
  async function fetchCultivos(row) {
    const idParcela = row.getAttribute('data-uid');
    const response = await fetch(`/gestor-cultivos/getCultivos?idParcela=${idParcela}`);
    const cultivos = await response.json();
    updateCultivosTable(cultivos);
    rebuildChart(cultivos);
  }

  // Función para actualizar la tabla de cultivos
  function updateCultivosTable(cultivos) {
    const cultivosTableBody = document.getElementById('cultivosTableBody');
    cultivosTableBody.innerHTML = '';
    cultivos.forEach(cultivo => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cultivo.idParcela}</td>
        <td>${cultivo.cultivo}</td>
        <td>${cultivo.fechayhora}</td>
        <td class="acciones">
          <button class="btn" onclick="updateCultivo('${cultivo.idParcela}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn red-btn" onclick="borrarCultivo('${cultivo.idParcela}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      cultivosTableBody.appendChild(row);
    });
  }

  // Función para reconstruir el gráfico con los nuevos datos
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

  // Exponer funciones al ámbito global para ser accesibles desde HTML
  window.showTab = showTab;
  window.showSubTab = showSubTab;
  window.openModal = openModal;

  // Añadir evento de clic al botón de edición
  editButton.addEventListener('click', openModal);
});

document.querySelectorAll('.accordion-title').forEach(item => {
  item.addEventListener('click', () => {
      const content = item.nextElementSibling;
      const allAccordionContents = document.querySelectorAll('.accordion-content');
      const allAccordionTitles = document.querySelectorAll('.accordion-title');
      
      // Cerrar todos los elementos del acordeón
      allAccordionContents.forEach(content => {
          content.style.display = 'none';
      });
      
      // Eliminar la clase 'active' de todos los títulos
      allAccordionTitles.forEach(title => {
          title.querySelector('i').classList.remove('fa-chevron-up');
          title.querySelector('i').classList.add('fa-chevron-down');
      });
      
      // Abrir o cerrar el contenido del acordeón según su estado actual
      if (content.style.display === 'block') {
          content.style.display = 'none';
          item.querySelector('i').classList.remove('fa-chevron-up');
          item.querySelector('i').classList.add('fa-chevron-down');
      } else {
          content.style.display = 'block';
          item.querySelector('i').classList.remove('fa-chevron-down');
          item.querySelector('i').classList.add('fa-chevron-up');
      }
  });
});


