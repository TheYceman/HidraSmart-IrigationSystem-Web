async function updateRol(nombre) {
    alert(nombre);

    const perUsu = document.querySelector(`[data-field="perUsu"][data-id="${nombre}"] select`).value;
    const perVisor = document.querySelector(`[data-field="perVisor"][data-id="${nombre}"] select`).value;
    const perMeteo = document.querySelector(`[data-field="perMeteo"][data-id="${nombre}"] select`).value;
    const perRed = document.querySelector(`[data-field="perRed"][data-id="${nombre}"] select`).value;
    const perDemandas = document.querySelector(`[data-field="perDemandas"][data-id="${nombre}"] select`).value;
    const perRiego = document.querySelector(`[data-field="perRiego"][data-id="${nombre}"] select`).value;
    const perEquipos = document.querySelector(`[data-field="perEquipos"][data-id="${nombre}"] select`).value;
   
    const data = {
        nombre: nombre,
        perUsu: perUsu,
        perVisor: perVisor,
        perMeteo: perMeteo,
        perRed: perRed,
        perDemandas: perDemandas,
        perRiego: perRiego,
        perEquipos: perEquipos
    };

    fetch("/gestor-usuarios/actualizarRol", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                alert('Rol actualizado correctamente');
            } else {
                alert('Error al actualizar el rol' + response);
            }
        })
        .catch((error) => {
            console.error('Error en la solicitud: ' + error.message);
        });

}

async function borrarRol(nombre) {
    alert(nombre);

    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
        const data = {
            nombre: nombre,
        };

        const response = await fetch("/gestor-usuarios/borrarRol", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Rol ' + id + ' eliminado ');
                } else {
                    alert('Error al eliminar el rol' + response);
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