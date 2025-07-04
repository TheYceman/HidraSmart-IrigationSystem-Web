import React, { useState } from 'react';
import "../../../public/styles/pop-up/gestorUsuarios.css";

export default function FilaGrupo({ 
  group, 
  permissionLevels, 
  onSave, 
  onDelete, 
  isNuevo = false, 
  onCancel 
}) {
  const [editing, setEditing] = useState(isNuevo); // ← comienza en edición si es nuevo
  const normalizeGroup = (group) => {
  const permisoKeys = [
    'per_cultivos', 'per_cupos', 'per_riegos', 'per_meteo',
    'per_red', 'per_activos', 'per_cambios', 'per_usuarios'
  ];
  
  const normalized = { ...group };

  permisoKeys.forEach(key => {
    const value = group[key];
    // Si viene como objeto con id, extraemos el id
    if (value && typeof value === 'object' && 'id' in value) {
      normalized[key] = String(value.id);
    } else {
      normalized[key] = value ? String(value) : '';
    }
  });

  return normalized;
};

const [values, setValues] = useState(normalizeGroup(group));


  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

 const renderSelect = (name) => (
  <select
    name={name}
    disabled={!editing}
    value={String(values[name] ?? '')}  // fuerza a string, incluso si null/undefined
    onChange={e => handleChange(name, e.target.value)}
    className="select-levels"
  >
    <option value="">--</option>
    {permissionLevels.map(level => (
      <option key={level.id} value={String(level.id)}>
        {level.level}
      </option>
    ))}
  </select>
);

  return (
    <tr>
      <td>{isNuevo ? 'Nuevo' : group.idGrupo}</td>
      <td>
        {editing ? (
          <input
            name="nombreGrupo"
            value={values.nombreGrupo}
            onChange={e => handleChange('nombreGrupo', e.target.value)}
          />
        ) : (
          group.nombreGrupo
        )}
      </td>
      <td>{renderSelect('per_cultivos')}</td>
      <td>{renderSelect('per_cupos')}</td>
      <td>{renderSelect('per_riegos')}</td>
      <td>{renderSelect('per_meteo')}</td>
      <td>{renderSelect('per_red')}</td>
      <td>{renderSelect('per_activos')}</td>
      <td>{renderSelect('per_cambios')}</td>
      <td>{renderSelect('per_usuarios')}</td>

      <td>
        {!editing ? (
          <>
            <button className='edit-btn' onClick={() => setEditing(true)}>Editar</button>
            <button className='delete-btn' onClick={() => onDelete(group.idGrupo)}>Eliminar</button>
          </>
        ) : (
          <>
            <button className='save-new-user-btn' onClick={() => { onSave(values); if (!isNuevo) setEditing(false); }}>
              Guardar
            </button>
            <button className='cancel-new-btn' onClick={() => {
              if (isNuevo && onCancel) {
                onCancel();
              } else {
                setValues(normalizeGroup(group));
                setEditing(false);
              }
            }}>
              Cancelar
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
