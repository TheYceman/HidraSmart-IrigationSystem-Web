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
  