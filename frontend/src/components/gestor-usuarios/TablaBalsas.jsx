
import React, { useEffect, useState } from 'react';
import FilaBalsas from './FilaBalsas.jsx';
import { fetchUsuarios } from '../../api/users.js'; 
import "../../../public/styles/pop-up/gestorUsuarios.css";

export default function TablaBalsas() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [filaExpandida, setFilaExpandida] = useState(null); 

  useEffect(() => {
    console.log("TABLA BALSAS");
    cargarUsuarios();

  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await fetchUsuarios();
      console.log("Datos recibidos:", data);
      setUsuarios(data);
      console.log(usuarios);
      setError(null);
    } catch (err) {
      console.error('Error al obtener usuarios:', err.message);
      setError(err.message);
    }
  };

  const toggleExpand = (id) => {
    setFilaExpandida(prev => (prev === id ? null : id));
  };

  return (
    <div id="user-permissions-table-container">
      {error ? (
        <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>
      ) : (
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
            {usuarios.map(user => (
              <FilaBalsas
                key={user.idusers}
                user={user}
                expandida={filaExpandida === user.idusers}
                onToggleExpand={() => toggleExpand(user.idusers)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
