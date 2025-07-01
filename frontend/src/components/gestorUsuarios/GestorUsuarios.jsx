import React, { useEffect, useState } from 'react';
import TabsUsuariosGrupos from './TabsUsuariosGrupos';
import TablaUsuarios from './TablaUsuarios';
import TablaGrupos from './TablaGrupos';
import '../../styles/head.css';

export default function GestorUsuarios() {
  const [activeTab, setActiveTab] = useState('usuarios');

  return (
    <div className="tab4_content">
      <TabsUsuariosGrupos activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'usuarios' && <TablaUsuarios />}
      {activeTab === 'grupos' && <TablaGrupos />}
    </div>
  );
}
