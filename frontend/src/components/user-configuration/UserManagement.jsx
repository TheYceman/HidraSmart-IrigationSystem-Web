import { useState } from 'react';
import '../../../public/styles/pop-up/PopupConfiguration.css';
import TabsUsuariosGrupos from '../gestorUsuarios/TabsUsuariosGrupos';
import TablaUsuarios from '../gestorUsuarios/TablaUsuarios';
import TablaGrupos from '../gestorUsuarios/TablaGrupos';

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
    </div>
  );
};

export default UserManagement;
