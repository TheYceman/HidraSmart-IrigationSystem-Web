import React, { useEffect, useState } from 'react';
import { fetchBalsasEstadoPorUsuario } from '../../api/balsas';
import "../../../public/styles/pop-up/gestorUsuarios.css";

export default function FilaBalsas({ user, expandida, onToggleExpand }) {
  const [balsas, setBalsas] = useState([]);
  const [originalBalsas, setOriginalBalsas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hayCambios = JSON.stringify(balsas) !== JSON.stringify(originalBalsas);


  useEffect(() => {
    if (expandida) {
      setLoading(true);
      fetchBalsasEstadoPorUsuario(user.idusers)
        .then(data => {
          setBalsas(data);
          setOriginalBalsas(data); // guardar copia original
          setError(null);
        })
        .catch(err => {
          console.error("Error al cargar balsas:", err);
          setError('No se pudieron cargar las balsas');
        })
        .finally(() => setLoading(false));
    }
  }, [expandida, user.idusers]);

  const handleSelectChange = (balsaId, nuevoEstado) => {
    setBalsas(prev =>
      prev.map(b =>
        b.id_balsa === balsaId ? { ...b, estado: nuevoEstado } : b
      )
    );
  };

  const handleCancelar = () => {
    setBalsas(originalBalsas);
  };

  const handleAplicar = () => {
    // Aquí llamarías a tu API para actualizar los permisos
    console.log("Enviando cambios al backend:", balsas);
    // Aquí podrías mostrar un toast, feedback visual, etc.
  };

  return (
    <>
      <tr>
        <td>{user.idusers}</td>
        <td>{user.username}</td>
        <td>{user.name}</td>
        <td>{user.surname}</td>
        <td>{user.email}</td>
        <td>
        <button
            className={`edit-btn ${expandida ? 'cerrar-btn' : ''}`}
            onClick={onToggleExpand}
          >
            {expandida ? "Cerrar" : "Balsas"}
        </button>

        </td>
      </tr>

      {expandida && (
        <tr>
          <td colSpan="6">
            <div className="balsas-expandido">
              <strong>Balsas asignadas:</strong>
              {loading ? (
                <p>Cargando balsas...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                <>
                  {Object.entries(
                    balsas.reduce((acc, balsa) => {
                      if (!acc[balsa.name_network]) acc[balsa.name_network] = [];
                      acc[balsa.name_network].push(balsa);
                      return acc;
                    }, {})
                  ).map(([red, balsasDeRed]) => (
                    <div key={red} style={{ marginBottom: '1.5rem' }}>
                      <p><strong>{red}:</strong></p>
                      <table className="tabla-redes">
                        <thead>
                          <tr>
                            <th>Balsa</th>
                            <th>Permiso</th>
                          </tr>
                        </thead>
                        <tbody>
                          {balsasDeRed.map((balsa) => (
                            <tr key={balsa.id_balsa}>
                              <td>{balsa.num_balsa}</td>
                              <td>
                                <select
                                  className='select-balsas'
                                  value={balsa.estado}
                                  onChange={(e) =>
                                    handleSelectChange(balsa.id_balsa, e.target.value)
                                  }
                                >
                                  <option value="permitido">Permitido</option>
                                  <option value="denegado">Denegado</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}

                  {/* Botones de acción */}
                 <div className="botones-balsas">
                <button
                  className="aplicar-btn"
                  onClick={handleAplicar}
                  disabled={!hayCambios}
                >
                  Aplicar
                </button>
                <button
                  className="cancelar-btn"
                  onClick={handleCancelar}
                  disabled={!hayCambios}
                >
                  Cancelar
                </button>
              </div>

                </>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
