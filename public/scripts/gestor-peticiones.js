async function updatePeticion(idPeticion) {
    alert(idPeticion);
    const tipo = document.querySelector(`[data-field="tipo"][data-id="${idPeticion}"]`).textContent;
    const usuario = document.querySelector(`[data-field="usuario"][data-id="${idPeticion}"]`).textContent;
    const estado = document.querySelector(`[data-field="estado"][data-id="${idPeticion}"]`).textContent;
    const comentarios = document.querySelector(`[data-field="comentarios"][data-id="${idPeticion}"]`).textContent;
    const asignadoa = document.querySelector(`[data-field="asignadoa"][data-id="${idPeticion}"]`).textContent;
    const data = {
        idPeticion: idPeticion,
        tipo: tipo,
        usuario: usuario,
        estado: estado,
        comentarios: comentarios,
        asignadoa: asignadoa,
    };

    fetch("/gestor-peticiones/actualizarPeticion", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert('Petición actualizada correctamente');
            } else {
                alert('Error al actualizar la petición' + response);
            }
        })
        .catch((error) => {
            console.error('Error en la solicitud: ' + error.message);
        });

}

async function borrarPeticion(numero) {
    alert(numero);

    if (confirm("¿Estás seguro de que deseas eliminar esta petición?")) {
        const data = {
            numero: numero,
        };

        const response = await fetch("/gestor-peticiones/borrarPeticion", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Petición ' + id + ' eliminado ');
                } else {
                    alert('Error al eliminar la peticion' + response);
                }
            })
            .catch((error) => {
                console.error('Error en la solicitud: ' + error.message);
            });
        //const data = await response.json();
        console.log("Response " + response);
    } else {
        // Si el usuario hace clic en "Cancelar", no hagas nada.
        console.log("Eliminación cancelada");
    }

}


document.addEventListener('DOMContentLoaded', () => {
    const petitionsContainer = document.getElementById('petitions-container');
    const filterButtons = document.querySelectorAll('#filter-buttons button');

    // Cargar y mostrar todas las peticiones al cargar la página
    fetch('/api/petitions')
        .then(response => response.json())
        .then(petitions => {
            displayPetitions(petitions);
            addFilterFunctionality(petitions);
        });

    function displayPetitions(petitions) {
        petitionsContainer.innerHTML = '';
        petitions.forEach(petition => {
            const card = document.createElement('div');
            card.classList.add('petition-card');

            card.innerHTML = `
          <h3>${petition.name}</h3>
          <p><strong>ID:#</strong> ${petition.id}</p>
          <p><strong>Pendientes:</strong> ${petition.requester}</p>
          <p><strong>Asignadas:</strong> ${petition.assignedTo}</p>
          <p><strong>Prioridad alta:</strong> ${petition.priority}</p>
          <p><strong>Estado:</strong> ${petition.status}</p>
        `;

            petitionsContainer.appendChild(card);
        });
    }

    function addFilterFunctionality(petitions) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const status = button.getAttribute('data-status');
                const filteredPetitions = status === 'all' ? petitions : petitions.filter(petition => petition.status.toLowerCase().includes(status));

                displayPetitions(filteredPetitions);
            });
        });
    }


    const searchInput = document.getElementById("search");

    searchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.toLowerCase();

        // Accede a la variable de Node.js (miVariable) y asígnala a una variable de JavaScript

        var found = false;
        for (var i = 0; i < todos.length; i++) {
            //console.log("contador['id'] " + todos[i].id + " " + searchTerm);
            if ((todos[i].login.toLowerCase()).includes(searchTerm)) {
                found = true;
                break;
            }

        }
        if (found) {
            var pagina = (i / 10) + 1;
            console.log("Página: " + parseInt(pagina));
            location.href = "/gestor-peticiones?page=" + parseInt(pagina);
            //row.style.display = "";
        } else {
            //row.style.display = "none";
        }

    });

    /*
    const mostrarFormularioButton = document.getElementById('mostrarFormPeticiones');
    const miFormulario = document.getElementById('peticionesForm');

    mostrarFormularioButton.addEventListener('click', () => {
        // Cambia la visibilidad del formulario cuando se hace clic en el botón
        if (miFormulario.style.display === 'none') {
            miFormulario.style.display = 'block';
        } else {
            miFormulario.style.display = 'none';
        }
    });
*/

});
