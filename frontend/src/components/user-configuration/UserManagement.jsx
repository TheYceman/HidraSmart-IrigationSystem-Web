import { useState } from 'react';
import '../../../public/styles/pop-up/PopupConfiguration.css';
import TabsUsuariosGrupos from '../gestor-usuarios/TabsUsuariosGrupos';
import TablaUsuarios from '../gestor-usuarios/TablaUsuarios';
import TablaGrupos from '../gestor-usuarios/TablaGrupos';
import TablaBalsas from '../gestor-usuarios/TablaBalsas';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('usuarios');

  return (
    <div className="tab_content_popup_configuration">
      <span
        id="title-popup-configuration-user"
        className="title_popup_configuration_user"
      >
        GESTIÓN DE USUARIOS
      </span>

      <TabsUsuariosGrupos
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'usuarios' && <TablaUsuarios />}
      {activeTab === 'grupos' && <TablaGrupos />}
      {activeTab === 'balsas' && <TablaBalsas />}
    </div>
  );
};

export default UserManagement;
