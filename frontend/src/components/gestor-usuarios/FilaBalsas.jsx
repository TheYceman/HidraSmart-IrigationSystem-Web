import React, { useState } from 'react';
import "../../../public/styles/pop-up/gestorUsuarios.css";

export default function FilaBalsas({ user, expandida, onToggleExpand }) {
  return (
    <>
      <tr>
        <td>{user.idusers}</td>
        <td>{user.username}</td>
        <td>{user.name}</td>
        <td>{user.surname}</td>
        <td>{user.email}</td>
        <td>
          <button className='edit-btn' onClick={onToggleExpand}>
            {expandida ? "Cerrar" : "Balsas"}
          </button>
        </td>
      </tr>

      {expandida && (
        <tr>
          <td colSpan="6">
            <div className="balsas-expandido">
              {/* Aquí puedes meter lo que quieras */}
              <strong>Balsas asignadas al usuario:</strong>
              <ul>
                <li>Balsa 1</li>
                <li>Balsa 2</li>
              </ul>
              {/* o usar otro componente como FilaPermisosRedes */}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

