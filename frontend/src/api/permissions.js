let permissionLevelsCache = [];

export async function fetchPermissionLevels() {
  if (permissionLevelsCache.length) return permissionLevelsCache;
  const res = await fetch('/api/permission-levels');
  const data = await res.json();
  permissionLevelsCache = data;
  return data;
}

export async function fetchPermissionGroups() {
  const res = await fetch('/api/all-permission-group');

  if (!res.ok) {
    let errorMessage = 'Error al obtener grupos de permisos';

    try {
      const errorData = await res.json();
      if (errorData?.error) errorMessage = errorData.error;
    } catch {
      // no hacemos nada si no puede leer JSON
    }

    if (res.status === 403) {
      errorMessage = 'Debes ser administrador para gestionar los grupos.';
    }

    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export async function updatePermissionGroup(id, updatedData) {
  const res = await fetch(`/api/update-permission-group/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  return res.ok;
}

export async function deletePermissionGroup(id) {
  const res = await fetch(`/api/delete-permission-group/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function createPermissionGroup(newGroupData) {
  const res = await fetch(`/api/create-permission-group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGroupData),
  });
  return res.ok;
}
