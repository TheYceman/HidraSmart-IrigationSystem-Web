
import { useState } from 'react';
import '../../../public/styles/pop-up/PopupConfiguration.css';


const UserManagement = () => {

    return (
        <div className="tab_content_popup_configuration">
            <span
                id="title-popup-configuration-user"
                className="title_popup_configuration_user"
            >
                GESTIÓN DE USUARIOS
            </span>
            <div
                className="dropdown-container"
                style={{
                    margin: '20px',
                    position: 'relative',
                    zIndex: 1002,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <label
                    htmlFor="dropdown"
                    style={{
                        fontSize: '16px',
                        marginRight: '10px',
                        color: '#333',
                    }}
                >
                    Selecciona una opción:
                </label>
                <select
                    id="dropdown"
                    name="dropdown"
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '200px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 1003,
                        appearance: 'auto',
                        WebkitAppearance: 'auto',
                        MozAppearance: 'auto',
                    }}
                >
                    <option value="opcion1">Opción 1</option>
                    <option value="opcion2">Opción 2</option>
                    <option value="opcion3">Opción 3</option>
                </select>
            </div>
        </div>

    );
};

export default UserManagement;




