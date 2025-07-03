import React, { useEffect, useState } from 'react';
import "../../../public/styles/pop-up/gestorUsuarios.css";
import {
  fetchRedes,
  fetchGruposPermiso,
  fetchPermisosUsuario,
  updatePermisosUsuario,
} from '../../api/users.js';

export default function FilaPermisosRedes({ userId, onClose }) {
  const [networks, setNetworks] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [nets, gruposPermiso, permisosUsuario] = await Promise.all([
        fetchRedes(),
        fetchGruposPermiso(),
        fetchPermisosUsuario(userId),
      ]);

      setNetworks(nets);
      console.log(nets);
      setGrupos(gruposPermiso);
      setPermisos(permisosUsuario);
    } catch (error) {
      console.error("Error cargando datos de permisos por red:", error);
    }
  };

  const getGrupo = (networkId) =>
    permisos.find((p) => p.id_network === networkId)?.id_permission_group || '';

  const handleChange = (id_network, id_permission_group) => {
    setPermisos((prev) =>
      prev.map((p) =>
        p.id_network === id_network
          ? { ...p, id_permission_group }
          : p
      )
    );
  };

  const guardar = async () => {
    const updates = permisos.map((p) => ({
      id_users: userId,
      id_network: p.id_network,
      id_permission_group: parseInt(p.id_permission_group),
    }));

    try {
      await updatePermisosUsuario(updates);
      alert('Permisos actualizados');
      onClose();
    } catch (error) {
      console.error("Error al actualizar permisos:", error);
      alert('Error al actualizar permisos');
    }
  };

  return (
    <tr className="permissions-row">
      <td colSpan="6">
        <div className="permissions-panel">
          <h2>Permisos por red</h2>
          <table>
            <tbody>
              {networks.map((network) => (
                <tr key={network.id}>
                  <td className='network-permission'>{network.name_network}</td>
                  <td className='td-select-permissions'>
                    <select
                      className='select-permissions'
                      value={getGrupo(network.id)}
                      onChange={(e) => handleChange(network.id, e.target.value)}
                    >
                      <option value="">Sin permisos</option>
                      {grupos.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}>
                  <button className='apply-permissions-btn' onClick={guardar}>Aplicar Permisos</button>
                  <button className='cancel-btn' onClick={onClose}>Cancelar</button>
                </td>
              </tr>
            </tbody>
          </table>
          {/* <div>
          <button className='apply-permissions-btn' onClick={guardar}>Aplicar Permisos</button>
          <button className='cancel-btn' onClick={onClose}>Cancelar</button>
          </div> */}
        </div>
      </td>
    </tr>
  );
}