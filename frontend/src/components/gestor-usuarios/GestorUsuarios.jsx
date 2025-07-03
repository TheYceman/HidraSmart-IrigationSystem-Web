import React, { useEffect, useState } from 'react';
import TabsUsuariosGrupos from './TabsUsuariosGrupos';
import TablaUsuarios from './TablaUsuarios';
import TablaGrupos from './TablaGrupos';
import TablaBalsas from './TablaBalsas';
import '../../styles/head.css';
import "../../../public/styles/pop-up/gestorUsuarios.css";

export default function GestorUsuarios() {
  const [activeTab, setActiveTab] = useState('usuarios');

  return (
    <div className="tab4_content">
      <TabsUsuariosGrupos activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'usuarios' && <TablaUsuarios />}
      {activeTab === 'grupos' && <TablaGrupos />}
      {activeTab === 'balsas' && <TablaBalsas />}
    </div>
  );
}
