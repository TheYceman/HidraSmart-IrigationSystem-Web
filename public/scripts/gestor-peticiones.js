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