import React, { useEffect, useState } from 'react';
import "../../../public/styles/pop-up/gestorUsuarios.css";

export default function PermisosUsuarioModal({ userId, username, onClose }) {
  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/user-permissions/${userId}`);
      const data = await res.json();
      setPermisos(data);
    })();
  }, [userId]);

  return (
    <div className="permissions-popup">
      <div className="permissions-popup-inner">
        <span onClick={onClose} className="close-popup">×</span>
        <h3>Permisos del usuario: {username}</h3>
        <pre>{JSON.stringify(permisos, null, 2)}</pre>
      </div>
    </div>
  );
}
