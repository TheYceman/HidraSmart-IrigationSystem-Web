import React, { useEffect, useState } from 'react';
import FilaGrupo from './FilaGrupo';
import "../../../public/styles/pop-up/gestorUsuarios.css";
import {
  fetchPermissionLevels,
  fetchPermissionGroups,
  updatePermissionGroup,
  deletePermissionGroup,
  createPermissionGroup
} from '../../api/permissions';

export default function TablaGrupos() {
  const [groups, setGroups] = useState([]);
  const [levels, setLevels] = useState([]);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ nombreGrupo: '', ...defaultPermissions() });

  function defaultPermissions() {
    return {
      per_cultivos: '', per_cupos: '', per_riegos: '', per_meteo: '',
      per_red: '', per_activos: '', per_cambios: '', per_usuarios: ''
    };
  }


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const levelsData = await fetchPermissionLevels();
    const groupsData = await fetchPermissionGroups();


    setLevels(levelsData);
    setGroups(groupsData);
  };

  const handleSave = async (updatedGroup) => {
    const ok = await updatePermissionGroup(updatedGroup.idGrupo, updatedGroup);
    if (ok) loadData();
  };

  const handleDelete = async (id) => {
    if (confirm(`¿Eliminar grupo con ID ${id}?`)) {
      const ok = await deletePermissionGroup(id);
      if (ok) loadData();
    }
  };

  const handleCreate = async () => {
    const ok = await createPermissionGroup(newGroupData);
    if (ok) {
      setShowNewGroup(false);
      setNewGroupData({ nombreGrupo: '', ...defaultPermissions() });
      loadData();
    }
  };

  return (
    <div id="group-permissions-table-container">
      <div style={{  marginBottom: '16px' }}>
        {!showNewGroup && (
          <button className="add-user-btn" onClick={() => setShowNewGroup(true)}>Crear Grupo</button>
        )}
      </div>

      <table className="user-permissions-table">
        <thead>
          <tr>
            <th>ID Grupo</th>
            <th>Nombre</th>
            <th>Cultivos</th>
            <th>Cupos</th>
            <th>Riegos</th>
            <th>Meteo</th>
            <th>Red</th>
            <th>Activos</th>
            <th>Cambios</th>
            <th>Usuarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
  {showNewGroup && (
    <FilaGrupo
      isNuevo
      group={newGroupData}
      permissionLevels={levels}
      onSave={async (data) => {
        const ok = await createPermissionGroup(data);
        if (ok) {
          setShowNewGroup(false);
          setNewGroupData({ nombreGrupo: '', ...defaultPermissions() });
          loadData();
        }
      }}
      onCancel={() => {
        setShowNewGroup(false);
        setNewGroupData({ nombreGrupo: '', ...defaultPermissions() });
      }}
    />
  )}
  {groups.map(grupo => (
    <FilaGrupo
      key={grupo.idGrupo}
      group={grupo}
      permissionLevels={levels}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  ))}
</tbody>
      </table>
    </div>
  );
}
