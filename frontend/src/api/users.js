export async function fetchUsuarios() {
  const res = await fetch('/getAllUsers/');
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return await res.json();
}

export async function createUsuario(usuario) {
  const res = await fetch('/create-user/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw await res.json();
  return true;
}

export async function updateUsuario(id, datos) {
  const res = await fetch(`/update-user/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw await res.json();
  return true;
}

export async function deleteUsuario(id) {
  const res = await fetch(`/delete-user/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await res.json();
  return true;
}

export async function fetchRedes() {
  const res = await fetch('/networks');
  if (!res.ok) throw new Error('Error al obtener redes');
  return await res.json();
}

export async function fetchGruposPermiso() {
  const res = await fetch('/permission-group/');
  if (!res.ok) throw new Error('Error al obtener grupos de permisos');
  return await res.json();
}

export async function fetchPermisosUsuario(id) {
  const res = await fetch(`/user-permissions/${id}`);
  if (!res.ok) throw new Error('Error al obtener permisos de usuario');
  return await res.json();
}

export async function updatePermisosUsuario(permisos) {
  const res = await fetch('/update-user-permissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permisos),
  });

  if (!res.ok) throw await res.json();
  return true;
}

//PERMISOS USUARIOS
export async function fetchRedes() {
  const res = await fetch('/networks');
  if (!res.ok) throw new Error('Error al obtener redes');
  return await res.json();
}

export async function fetchGruposPermiso() {
  const res = await fetch('/permission-group/');
  if (!res.ok) throw new Error('Error al obtener grupos de permisos');
  return await res.json();
}

export async function fetchPermisosUsuario(idUsuario) {
  const res = await fetch(`/user-permissions/${idUsuario}`);
  if (!res.ok) throw new Error('Error al obtener permisos del usuario');
  return await res.json();
}

export async function updatePermisosUsuario(permisos) {
  const res = await fetch('/update-user-permissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permisos),
  });
  if (!res.ok) throw await res.json();
  return true;
}

