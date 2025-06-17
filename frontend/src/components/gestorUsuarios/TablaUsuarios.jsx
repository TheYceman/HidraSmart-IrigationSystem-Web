
import React, { useEffect, useState } from 'react';
import FilaUsuario from './FilaUsuario';
import FilaPermisosRedes from './FilaPermisosRedes';
import { fetchUsuarios } from '../../api/users.js'; 

export default function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await fetchUsuarios(); 
      setUsuarios(data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const handlePermisosClick = (id) => {
    setExpandedUserId(id === expandedUserId ? null : id);
  };

  const handleUsuarioCreado = () => {
    setNuevoUsuario(null);
    cargarUsuarios();
  };

  return (
    <div id="user-permissions-table-container">
      <button
        className="add-user-btn"
        onClick={() =>
          setNuevoUsuario({ username: '', name: '', surname: '', email: '', password: '' })
        }
      >
        Agregar Usuario
      </button>

      <table className="user-permissions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {nuevoUsuario && (
            <FilaUsuario
              isNuevo
              user={nuevoUsuario}
              onCancel={() => setNuevoUsuario(null)}
              onSave={handleUsuarioCreado}
            />
          )}
          {usuarios.map(user => (
            <React.Fragment key={user.idusers}>
              <FilaUsuario
                user={user}
                onPermisosClick={() => handlePermisosClick(user.idusers)}
                onSave={cargarUsuarios}
                onDelete={cargarUsuarios}
              />
              {expandedUserId === user.idusers && (
                <FilaPermisosRedes
                  userId={user.idusers}
                  onClose={() => setExpandedUserId(null)}
                />
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
