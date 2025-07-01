import React from 'react';
import "../../../public/styles/pop-up/gestorUsuarios.css";

export default function TabsUsuariosGrupos({ activeTab, setActiveTab }) {
  return (
    <div className="table-selector">
      <button className={activeTab === 'usuarios' ? 'active' : ''} onClick={() => setActiveTab('usuarios')}>
        Usuarios
      </button>
      <button className={activeTab === 'grupos' ? 'active' : ''} onClick={() => setActiveTab('grupos')}>
        Grupos
      </button>
    </div>
  );
}
