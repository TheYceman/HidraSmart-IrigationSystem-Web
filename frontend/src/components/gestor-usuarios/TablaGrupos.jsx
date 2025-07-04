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
  const [groups, setGroups] = useState(null);
  const [levels, setLevels] = useState([]);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ nombreGrupo: '', ...defaultPermissions() });
  const [error, setError] = useState('');

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
    try {
      const levelsData = await fetchPermissionLevels();
      const groupsData = await fetchPermissionGroups();

      setLevels(levelsData);

      if (!groupsData || groupsData.length === 0) {
        setError('No hay grupos disponibles o no tienes permisos para verlos.');
        setGroups([]);
      } else {
        setError('');
        setGroups(groupsData);
      }
    } catch (e) {
      setError('Debes ser administrador para acceder aquí');
      setGroups([]);
    }
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

  if (error) {
return (
  <div
    style={{
      color: "red",
      fontSize: "1.5em",
      marginBlockStart: "0.83em",
      marginBlockEnd: "0.83em",
      marginInlineStart: "0px",
      marginInlineEnd: "0px",
      fontWeight: "bold",
    }}
    className="error-message"
  >
    {error}
  </div>
);

  }

  if (groups === null) {
    // Mientras carga
    return <div>Cargando grupos...</div>;
  }

  return (
    <div id="group-permissions-table-container">
      <div style={{ marginBottom: '16px' }}>
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
