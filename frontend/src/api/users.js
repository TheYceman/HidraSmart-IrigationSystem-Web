export async function fetchUsuarios() {
  const res = await fetch('/api/getAllUsers/');

  if (!res.ok) {
    let mensaje = 'Error al obtener usuarios';

    // Intentar extraer mensaje del backend
    try {
      const json = await res.json();
      if (res.status === 403 && json?.error) {
        mensaje = json.error;
      }
    } catch (_) {
      // Si no es JSON, mantener mensaje por defecto
    }

    throw new Error(mensaje);
  }

  return await res.json();
}

export async function createUsuario(usuario) {
  const res = await fetch('/api/create-user/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw await res.json();
  return true;
}

export async function updateUsuario(id, datos) {
  const res = await fetch(`/api/update-user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw await res.json();
  return true;
}

export async function deleteUsuario(id) {
  const res = await fetch(`/api/delete-user/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await res.json();
  return true;
}

export async function fetchRedes() {
  const res = await fetch('/api/networks');
  if (!res.ok) throw new Error('Error al obtener redes');

  const redes = await res.json();

  const nombreRedMap = {
    pennarroya: "Peñarroya",
    argamasilla: "Argamasilla"
  };

  const redesFormateadas = redes.map(red => ({
    ...red,
    name_network: nombreRedMap[red.name_network] || red.name_network
  }));

  return redesFormateadas;
}



export async function fetchGruposPermiso() {
  const res = await fetch('/api/permission-group/');
  if (!res.ok) throw new Error('Error al obtener grupos de permisos');
  return await res.json();
}

export async function fetchPermisosUsuario(idUsuario) {
  const res = await fetch(`/api/user-permissions/${idUsuario}`);
  if (!res.ok) throw new Error('Error al obtener permisos del usuario');
  return await res.json();
}

export async function updatePermisosUsuario(permisos) {
  const res = await fetch('/api/update-user-permissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permisos),
  });
  if (!res.ok) throw await res.json();
  return true;
}
