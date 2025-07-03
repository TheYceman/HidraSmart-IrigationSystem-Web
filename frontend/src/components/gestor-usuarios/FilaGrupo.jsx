import React, { useState } from 'react';

export default function FilaGrupo({ group, permissionLevels, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({ ...group });

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const renderSelect = (name, selected) => (
    <select
      name={name}
      disabled={!editing}
      value={values[name]}
      onChange={e => handleChange(name, e.target.value)}
      className="select-levels"
    >
      {permissionLevels.map(level => (
        <option key={level.id} value={level.id}>
          {level.level}
        </option>
      ))}
    </select>
  );

  return (
    <tr>
      <td>{group.idGrupo}</td>
      <td>{group.nombreGrupo}</td>
      <td>{renderSelect('per_equipos', values.per_equipos)}</td>
      <td>{renderSelect('per_activos', values.per_activos)}</td>
      <td>{renderSelect('per_red', values.per_red)}</td>
      <td>{renderSelect('per_valvulas', values.per_valvulas)}</td>
      <td>{renderSelect('per_simulador', values.per_simulador)}</td>
      <td>{renderSelect('per_estadistica', values.per_estadistica)}</td>
      <td>
        {!editing ? (
          <>
            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={() => onDelete(group.idGrupo)}>Eliminar</button>
          </>
        ) : (
          <>
            <button onClick={() => { onSave(values); setEditing(false); }}>Guardar</button>
            <button onClick={() => { setValues({ ...group }); setEditing(false); }}>Cancelar</button>
          </>
        )}
      </td>
    </tr>
  );
}
