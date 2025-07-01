import React, { useEffect, useState } from 'react';
import FilaGrupo from './FilaGrupo';
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
      per_equipos: '', per_activos: '', per_red: '',
      per_valvulas: '', per_simulador: '', per_estadistica: ''
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
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {!showNewGroup ? (
          <button onClick={() => setShowNewGroup(true)}>Crear Grupo</button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Nombre del grupo"
              value={newGroupData.nombreGrupo}
              onChange={e => setNewGroupData({ ...newGroupData, nombreGrupo: e.target.value })}
            />
            {['equipos', 'activos', 'red', 'valvulas', 'simulador', 'estadistica'].map(field => (
              <select
                key={field}
                value={newGroupData[`per_${field}`]}
                onChange={e => setNewGroupData({ ...newGroupData, [`per_${field}`]: e.target.value })}
              >
                <option value="">-- {field} --</option>
                {levels.map(l => <option key={l.id} value={l.id}>{l.level}</option>)}
              </select>
            ))}
            <button onClick={handleCreate}>Guardar</button>
            <button onClick={() => setShowNewGroup(false)}>Cancelar</button>
          </>
        )}
      </div>

      <table className="user-permissions-table">
        <thead>
          <tr>
            <th>ID Grupo</th>
            <th>Nombre</th>
            <th>Equipos</th>
            <th>Activos</th>
            <th>Red</th>
            <th>Válvulas</th>
            <th>Simulador</th>
            <th>Estadística</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
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
