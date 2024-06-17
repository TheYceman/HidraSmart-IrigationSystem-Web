document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.tab-content');
  const tabLabels = document.querySelectorAll('.tab-label');
  const subTabButtons = document.querySelectorAll('.campo-tab-button');
  const subTabContents = document.querySelectorAll('.campo-tab-content');
  const rows = document.querySelectorAll('.selectable-row');
  const rows2 = document.querySelectorAll('.selectable-row2');
  const cultivoInfo = document.getElementById('cultivoInfo');
  const hectareasInfo = document.getElementById('hectareasInfo');
  //Tab cultivos
  const cultivoDeclarado = document.getElementById('cultivoDeclarado');
  const hectareasDeclaradas = document.getElementById('hectareasDeclaradas');
  const necesidadSemanal = document.getElementById('necesidadSemanal');
  const kc = document.getElementById('kc');
  const modal = document.getElementById('modal');
  //Fin cultivos
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
      cultivoDeclarado.textContent = `Cultivo: ${parcela.cultivo}`;//Modificar para hacerlo de cultivos
      hectareasDeclaradas.innerHTML = `Hectáreas: ${parcela.hectareas}`;//Modificar para hacerlo de cultivos
    } else {
      selectedParcelaId = null;
      cultivoInfo.textContent = 'Cultivo: N/A';
      hectareasInfo.innerHTML = 'Hectáreas: N/A';
      cultivoDeclarado.textContent = 'Cultivo: N/A';
      hectareasDeclaradas.innerHTML = 'Hectáreas: N/A';
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
        <td>${cultivo.ha}</td>
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

    const fechas = cultivos.map(cultivo => new Date(cultivo.fechayhora).toLocaleDateString('es-ES'));
    const tipos = cultivos.map(cultivo => cultivo.cultivo);
    const has = cultivos.map(cultivo => cultivo.ha);

    historicalChart.update({
      xAxis: {
        categories: fechas
      },
      series: [{
        name: 'Hectáreas',
        data: cultivos.map(cultivo => ({
          y: cultivo.ha,
          name: cultivo.cultivo
        })),
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${this.point.name}: ${this.y} ha`;
          }
        }
      }]
    });
  }

  const cultivosData = [
    { fechayhora: '2024-01-15T09:00:00.000Z', cultivo: 'Pimiento', ha: 5 },
    { fechayhora: '2024-02-20T09:00:00.000Z', cultivo: 'SIN RIEGO', ha: 0 },
    { fechayhora: '2024-03-10T09:00:00.000Z', cultivo: 'Almendros', ha: 8 },
    { fechayhora: '2024-04-05T09:00:00.000Z', cultivo: 'Vid', ha: 6 },
    { fechayhora: '2024-05-25T09:00:00.000Z', cultivo: 'Cebolla', ha: 10 },
    { fechayhora: '2024-06-15T09:00:00.000Z', cultivo: 'Pimiento', ha: 7 },
    { fechayhora: '2024-07-30T09:00:00.000Z', cultivo: 'Ajos', ha: 4 },
    { fechayhora: '2024-08-20T09:00:00.000Z', cultivo: 'Arboles', ha: 3 },
    { fechayhora: '2024-09-10T09:00:00.000Z', cultivo: 'Melón', ha: 12 },
    { fechayhora: '2024-10-05T09:00:00.000Z', cultivo: 'Guisantes', ha: 9 },
    { fechayhora: '2024-11-15T09:00:00.000Z', cultivo: 'Huerta', ha: 5 },
    { fechayhora: '2024-12-10T09:00:00.000Z', cultivo: 'Pimiento', ha: 7 }
  ];

  const historicalChart = Highcharts.chart('historicalChart', {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Histórico de Tipos de Cultivos y Hectáreas en 2024'
    },
    xAxis: {
      categories: [],
      title: {
        text: 'Fechas'
      }
    },
    yAxis: {
      title: {
        text: 'Hectáreas'
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Hectáreas',
      data: [],
      dataLabels: {
        enabled: true,
        formatter: function () {
          return `${this.point.name}: ${this.y} ha`;
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

  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const title = item.querySelector('.accordion-title');

    title.addEventListener('click', () => {
      const content = item.querySelector('.accordion-content');

      // Cierra todos los items del acordeón
      accordionItems.forEach(i => {
        i.querySelector('.accordion-content').classList.remove('active');
        i.querySelector('.accordion-title').classList.remove('active');
      });

      // Abre el tab actual
      content.classList.add('active');
      title.classList.add('active');
    });
  });

  // Despliega el primer tab por defecto
  accordionItems[0].querySelector('.accordion-title').classList.add('active');
  accordionItems[0].querySelector('.accordion-content').classList.add('active');

  //color label cupo
  const labelNumbers = document.querySelectorAll('.label-number-restante');

  labelNumbers.forEach(function (label) {
    const value = parseInt(label.textContent, 10);
    if (value < 1001) {
      label.classList.add('red');
    }
  });

  function getChartData() {

    // Asegúrate de que window.parcelas esté definido y sea un arreglo
    if (!window.parcelas || !Array.isArray(window.parcelas)) {
      return [];
    }

    if (!window.propietarioId) {
      return [];
    }

    // Filtra las parcelas por el propietario
    const propietarioId = window.propietarioId; // Aquí se asume que propietarioId se pasó correctamente
    const parcelasFiltradas = window.parcelas.filter(parcel => parseInt(parcel.propietario) === parseInt(propietarioId));
    console.log(window.parcelas[0].propietario);
    console.log(propietarioId);

    // Mapea las parcelas filtradas para crear el conjunto de datos
    const data = parcelasFiltradas.map(parcel => ({
      name: parcel.cultivo,
      y: parseFloat(parcel.hectareas)
    }));

    return data;
  }

  const data = getChartData();

  Highcharts.chart('highchart', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Hectáreas por Cultivo'
    },
    xAxis: {
      type: 'category',
      title: {
        text: 'Cultivo'
      }
    },
    yAxis: {
      title: {
        text: 'Hectáreas'
      }
    },
    series: [{
      name: 'Hectáreas',
      data: data,
      dataLabels: {
        enabled: true,
        format: '{point.y:.2f} ha'
      }
    }],
    credits: {
      enabled: false
    }
  });

});


