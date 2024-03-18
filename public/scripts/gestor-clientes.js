async function updateCliente(numero) {
    alert(numero);
    const nombre = document.querySelector(`[data-field="nombre"][data-id="${numero}"]`).textContent;
    const dni = document.querySelector(`[data-field="dni"][data-id="${numero}"]`).textContent;
    const telefono = document.querySelector(`[data-field="telefono"][data-id="${numero}"]`).textContent;
    const email = document.querySelector(`[data-field="email"][data-id="${numero}"]`).textContent;
    const data = {
        numero: numero,
        nombre: nombre,
        dni: dni,
        telefono: telefono,
        email: email,
    };

    fetch("/gestor-clientes/actualizarCliente", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert('Cliente actualizado correctamente');
            } else {
                alert('Error al actualizar el cliente' + response);
            }
        })
        .catch((error) => {
            console.error('Error en la solicitud: ' + error.message);
        });

}

async function borrarCliente(numero) {
    alert(numero);

    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
        const data = {
            numero: numero,
        };

        const response = await fetch("/gestor-clientes/borrarCliente", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Cliente ' + id + ' eliminado ');
                } else {
                    alert('Error al eliminar el cliente' + response);
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