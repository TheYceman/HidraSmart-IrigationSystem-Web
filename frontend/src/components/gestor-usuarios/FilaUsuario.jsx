import React, { useState } from 'react';
import {
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../../api/users.js'; 

export default function FilaUsuario({ user, isNuevo = false, onSave, onCancel, onPermisosClick, onDelete }) {
  const [editando, setEditando] = useState(isNuevo);
  const [datos, setDatos] = useState({ ...user });

  const handleChange = (e) => {
    setDatos((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const guardar = async () => {
    try {
      if (isNuevo) {
        await createUsuario(datos);
        alert('Usuario creado');
      } else {
        await updateUsuario(user.idusers, datos);
        alert('Usuario actualizado');
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(error.message || 'Error al guardar usuario');
    }
  };

  const eliminar = async () => {
    if (!confirm(`¿Eliminar usuario con ID ${user.idusers}?`)) return;

    try {
      await deleteUsuario(user.idusers);
      alert('Eliminado');
      onDelete();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(error.message || 'Error al eliminar usuario');
    }
  };

  return (
    <tr>
      <td>{isNuevo ? 'Nuevo' : user.idusers}</td>
      <td><input name="username" value={datos.username} onChange={handleChange} disabled={!editando} /></td>
      <td><input name="name" value={datos.name} onChange={handleChange} disabled={!editando} /></td>
      <td><input name="surname" value={datos.surname} onChange={handleChange} disabled={!editando} /></td>
      <td><input name="email" value={datos.email} onChange={handleChange} disabled={!editando} /></td>
      <td>
        {!editando ? (
          <>
            <button onClick={() => setEditando(true)}>Editar</button>
            <button onClick={eliminar}>Eliminar</button>
            <button onClick={onPermisosClick}>Permisos</button>
          </>
        ) : (
          <>
            {isNuevo && (
              <input
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                type="password"
              />
            )}
            <button onClick={guardar}>Guardar</button>
            <button onClick={() => {
              if (isNuevo) onCancel();
              else setEditando(false);
            }}>Cancelar</button>
          </>
        )}
      </td>
    </tr>
  );
}
