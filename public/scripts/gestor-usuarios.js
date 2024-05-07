async function updateUsuario(login) {
    alert(login);
    //const login = document.querySelector(`[data-field="login"][data-id="${id}"]`).textContent;
    const nombre = document.querySelector(`[data-field="name"][data-id="${login}"]`).textContent;
    const apellido = document.querySelector(`[data-field="surname"][data-id="${login}"]`).textContent;
    const grupo = document.querySelector(`[data-field="grupo"][data-id="${login}"]`).textContent;
    const email = document.querySelector(`[data-field="email"][data-id="${login}"]`).textContent;
    const phone = document.querySelector(`[data-field="phone"][data-id="${login}"]`).textContent;
    const data = {
        username: login,
        name: nombre,
        surname: apellido,
        grupo: grupo,
        email: email,
        phone: phone,
    };

    fetch("/gestor-usuarios/actualizarUsuario", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert('Usuario actualizado correctamente');
            } else {
                alert('Error al actualizar el usuario' + response);
            }
        })
        .catch((error) => {
            console.error('Error en la solicitud: ' + error.message);
        });

}

async function borrarUsuario(login) {
    alert(login);

    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
        const data = {
            username: login,
        };

        const response = await fetch("/gestor-usuarios/borrarUsuario", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Usuario ' + login + ' eliminado ');
                } else {
                    alert('Error al eliminar el usuario' + response);
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