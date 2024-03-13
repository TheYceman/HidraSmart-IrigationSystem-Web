function buildTable(nombresColumnas, registros, idContenedor, mostrarBotones) {
  var table_structure = `
    <div class="table-container" id="table-container-regantes">  
      <table >
          <thead>
              <tr>`;
  if (registros.length > 0) {
    var registro = registros[0];
    var indice = 0;
    for (var key in registro) {
      console.log(nombresColumnas[indice]);
      table_structure += `<th>` + nombresColumnas[indice] + `</th>`;
      indice++;
    }
  }

  if (mostrarBotones) {
    table_structure += `
                <th class="actions_th">Acciones <button id="add-record-button" title="Agregar nuevo registro">&#43;</button>
                </th>
              `;
  }

  table_structure += `
              </tr>
          </thead>
          <tbody id="table">
          <!-- Aquí se generarán dinámicamente las filas de la tabla -->
          </tbody>
      </table>
    </div>
  `;

  var table_structure_object = document.getElementById(idContenedor);
  table_structure_object.innerHTML = table_structure;

  // Obtener referencia a la tabla
  var idContenedor = document.getElementById("table");

  // Agregar registros a la tabla
  for (var i = 0; i < registros.length; i++) {
    var registro = registros[i];
    var row = idContenedor.insertRow();

    for (var key in registro) {
      row.insertCell().innerText = registro[key];
    }

    if (mostrarBotones) {
      var actionsCell = row.insertCell();
      actionsCell.classList.add("actions");
      actionsCell.innerHTML = `
        <button class="edit-button">Editar</button>
        <button class="delete-button">Borrar</button>
      `;
    }
  }

  if (mostrarBotones) {
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
  }
}

var registrosRegantes = [
  {
    nombre: "Pedro",
    apellidos: "González",
    telefono: "111111111",
    email: "pedro@example.com",
    direccion: "Calle Mayor 123",
  },
  {
    nombre: "Ana",
    apellidos: "Sánchez",
    telefono: "222222222",
    email: "ana@example.com",
    direccion: "Avenida Central 456",
  },
  {
    nombre: "Luis",
    apellidos: "Martínez",
    telefono: "333333333",
    email: "luis@example.com",
    direccion: "Calle Principal 789",
  },
  {
    nombre: "María",
    apellidos: "Gómez",
    telefono: "444444444",
    email: "maria@example.com",
    direccion: "Avenida Central 987",
  },
  {
    nombre: "José",
    apellidos: "Rodríguez",
    telefono: "555555555",
    email: "jose@example.com",
    direccion: "Calle Mayor 654",
  },
  {
    nombre: "Laura",
    apellidos: "López",
    telefono: "666666666",
    email: "laura@example.com",
    direccion: "Avenida Central 321",
  },
  {
    nombre: "Carlos",
    apellidos: "Fernández",
    telefono: "777777777",
    email: "carlos@example.com",
    direccion: "Calle Principal 456",
  },
  {
    nombre: "Sara",
    apellidos: "Pérez",
    telefono: "888888888",
    email: "sara@example.com",
    direccion: "Avenida Central 654",
  },
  {
    nombre: "Javier",
    apellidos: "González",
    telefono: "999999999",
    email: "javier@example.com",
    direccion: "Calle Mayor 987",
  },
  {
    nombre: "Marta",
    apellidos: "Sánchez",
    telefono: "101010101",
    email: "marta@example.com",
    direccion: "Avenida Central 789",
  },
  {
    nombre: "Daniel",
    apellidos: "García",
    telefono: "121212121",
    email: "daniel@example.com",
    direccion: "Calle Principal 123",
  },
  {
    nombre: "Isabel",
    apellidos: "López",
    telefono: "131313131",
    email: "isabel@example.com",
    direccion: "Avenida Central 123",
  },
  {
    nombre: "Juan",
    apellidos: "Hernández",
    telefono: "141414141",
    email: "juan@example.com",
    direccion: "Calle Mayor 321",
  },
  {
    nombre: "Carmen",
    apellidos: "Ruiz",
    telefono: "151515151",
    email: "carmen@example.com",
    direccion: "Avenida Central 321",
  },
  {
    nombre: "Antonio",
    apellidos: "Gómez",
    telefono: "161616161",
    email: "antonio@example.com",
    direccion: "Calle Principal 321",
  },
];
