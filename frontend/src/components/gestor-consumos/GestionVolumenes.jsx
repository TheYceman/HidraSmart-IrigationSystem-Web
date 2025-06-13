import React from "react";
import styles from "../../../public/styles/gestor-consumos/gestor-volumenes.module.css";

function GestionVolumenes() {
    return (
        <div className={styles.warning}>
            <h1>
                Esta página está en producción
                <i className="fas fa-exclamation-triangle"></i>
            </h1>
            <h2>Vuelve mas tarde</h2>
        </div>
    );
}

export default GestionVolumenes;
