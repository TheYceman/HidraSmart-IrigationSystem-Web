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


document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.filter-button');
    const petitions = document.querySelectorAll('.petition-card');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const status = this.getAttribute('data-status');

            // Quitar la clase 'active' de todos los botones
            buttons.forEach(btn => btn.classList.remove('active'));

            // Añadir la clase 'active' al botón clicado
            this.classList.add('active');


            // Filtrar peticiones
            petitions.forEach(petition => {

                if (status === 'all') {
                    // Mostrar todas las peticiones
                    petition.style.display = 'block';
                } else if (status === 'pending') {
                    // Mostrar solo las peticiones pendientes
                    if (petition.getAttribute('data-status') === 'Pendiente') {
                        petition.style.display = 'block';
                    } else {
                        petition.style.display = 'none';
                    }
                } else if (status === 'assigned-to-me') {
                    // Mostrar solo las peticiones asignadas a mí
                    console.log(petition.getAttribute('data-assigned-to').trim() + " " + idUsuario);
                    console.log('Comparing directly:', parseInt(petition.getAttribute('data-assigned-to')) === parseInt(idUsuario)); // Debe ser true
                    if (parseInt(petition.getAttribute('data-assigned-to').trim()) === parseInt(idUsuario) && petition.getAttribute('data-status') !== 'Pendiente') {
                        petition.style.display = 'block';
                    } else {
                        petition.style.display = 'none';
                    }
                } else if (status === 'approved') {
                    // Mostrar solo las peticiones aprobadas (no pendientes)
                    if (petition.getAttribute('data-status') !== 'Pendiente') {
                        petition.style.display = 'block';
                    } else {
                        petition.style.display = 'none';
                    }
                } else if (status === 'tasks') {
                    // Aquí puedes añadir lógica para mostrar las tareas si es necesario
                    if (petition.getAttribute('data-status') !== 'Pendiente') {
                        petition.style.display = 'block';
                    } else {
                        petition.style.display = 'none';
                    }
                }
            });
        });
    });
});
