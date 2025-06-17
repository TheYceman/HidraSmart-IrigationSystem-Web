let permissionLevelsCache = [];

export async function fetchPermissionLevels() {
  if (permissionLevelsCache.length) return permissionLevelsCache;
  const res = await fetch('/permission-levels');
  const data = await res.json();
  permissionLevelsCache = data;
  return data;
}

export async function fetchPermissionGroups() {
  const res = await fetch('/all-permission-group');
  return await res.json();
}

export async function updatePermissionGroup(id, updatedData) {
  const res = await fetch(`/update-permission-group/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  return res.ok;
}

export async function deletePermissionGroup(id) {
  const res = await fetch(`/delete-permission-group/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function createPermissionGroup(newGroupData) {
  const res = await fetch(`/create-permission-group`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGroupData)
  });
  return res.ok;
}
