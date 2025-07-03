import React from 'react';
import styles from "../../../public/styles/pop-up/pop-up.module.css";

const PopupConfig = ({
  isOpen,
  onClose,
  title = "",
  width = "40%",
  height = "600px",
  children,
  footer = null,
  showCloseButton = true,
  isUserManagerActive = false // <-- nueva prop para saber si el tab4(GestorUsuarios) está activo
}) => {
  if (!isOpen) return null;

  const popupStyle = {
    width,
    height
  };

  return (
    <div className={styles.popup_overlay}>
      <div
        className={`${styles.popup_content} ${isUserManagerActive ? styles.expandExtraLarge : ""}`}
        style={popupStyle}
      >
        <div className={styles.popup_header}>
          <span>{title}</span>
          {showCloseButton && (
            <button className={styles.popup_close} onClick={onClose}>×</button>
          )}
        </div>

        <div className={styles.popup_body}>
          {children}
        </div>

        {footer && (
          <div className={styles.popup_footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupConfig;
