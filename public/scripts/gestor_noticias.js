// Obtener referencia a la tabla
var table = document.getElementById("table");

// Agregar registros a la tabla
for (var i = 0; i < registros.length; i++) {
  var registro = registros[i];
  var row = table.insertRow();

  row.insertCell().innerText = registro.id;
  row.insertCell().innerText = registro.date;
  row.insertCell().innerText = registro.title;
  row.insertCell().innerText = registro.body;
  row.insertCell().innerText = registro.image;

  var actionsCell = row.insertCell();
  actionsCell.classList.add("actions");
  actionsCell.innerHTML = `
      <button class="edit-button">Editar</button>
      <button class="delete-button">Borrar</button>
    `;
}

// Event listener para el botón "Agregar registro"
var addRecordButton = document.getElementById("add-record-button");
addRecordButton.addEventListener("click", function () {
  // Aquí puedes implementar la lógica para agregar un nuevo registro a la tabla
  console.log("Botón 'Agregar registro' clickeado");
});

// Event listeners para los botones "Editar" y "Borrar"
var editButtons = document.querySelectorAll(".edit-button");
var deleteButtons = document.querySelectorAll(".delete-button");

editButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Aquí puedes implementar la lógica para editar un registro
    console.log("Botón 'Editar' clickeado");
  });
});

deleteButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Aquí puedes implementar la lógica para borrar un registro
    console.log("Botón 'Borrar' clickeado");
  });
});
