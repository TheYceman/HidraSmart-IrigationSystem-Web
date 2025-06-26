import { useState, useEffect } from 'react';
import '../../../public/styles/pop-up/PopupConfiguration.css';
import { handleChangePassword } from '../../../public/scripts/change-password.js';

const ChangePassword = ({ popupData, fadeMixinNotTime }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setRepeatPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    // Add states for password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Estados para controlar la validez individual de cada campo
    const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

    const validatePassword = (password, currentPassword, confirmPassword) => {
        const errors = [];
        
        if (!/(?=.*[a-z])/.test(password)) {
            errors.push('Debe contener al menos una letra minúscula');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            errors.push('Debe contener al menos una letra mayúscula');
        }
        if (!/(?=.*\d)/.test(password)) {
            errors.push('Debe contener al menos un número');
        }
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
            errors.push('Debe contener al menos un carácter especial');
        }
        if (password.length < 9) {
            errors.push('Debe tener al menos 9 caracteres');
        }
        if (password === currentPassword) {
            errors.push('La nueva contraseña debe ser diferente a la anterior');
        }
        if (password !== confirmPassword) {
            errors.push('Las contraseñas no coinciden');
        }

        return errors;
    };

    useEffect(() => {
        const errors = validatePassword(newPassword, currentPassword, confirmPassword);
        setPasswordErrors(errors);
        
        // Validación individual por campo basada únicamente en la longitud (>= 9 caracteres)
        setIsCurrentPasswordValid(currentPassword.length >= 9);
        setIsNewPasswordValid(newPassword.length >= 9);
        setIsConfirmPasswordValid(confirmPassword.length >= 9);
        
        setIsFormValid(
            currentPassword.length > 0 &&
            newPassword.length > 0 &&
            confirmPassword.length > 0 &&
            errors.length === 0
        );
    }, [newPassword, currentPassword, confirmPassword]);

    const subirFormulario = async (e) => {
        e.preventDefault();
        
        const errors = validatePassword(newPassword, currentPassword, confirmPassword);
        setPasswordErrors(errors);

        if (errors.length === 0) {
            const success = await handleChangePassword(
                e,
                popupData?.username,
                currentPassword,
                newPassword,
                confirmPassword,
                fadeMixinNotTime,
                popupData?.two_factor_enabled,
                errors,
                popupData?.email,
            );
            if (success) {
                setCurrentPassword('');
                setNewPassword('');
                setRepeatPassword('');
                setPasswordErrors([]);
            }
        }
    };

    return (
        <div className="tab_content_popup_configuration">
            <form
                id="form-popup-configuration"
                className="form_popup_configuration"
                autoComplete="off"
                inputMode="none"
                aria-autocomplete="none"
                method="POST"
                onSubmit={subirFormulario}
            >
                <div id="body-form-popup-configuration" className="body_form_popup_configuration">
                    <div id="fields-popup-configuration" className="fields_popup_configuration">
                        <label className="label_old_password">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="input-old-password"
                                className="input_old_password"
                                placeholder=" "
                                autoComplete="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <span className="label_name_old_password">Antigua Contraseña</span>
                            <span 
                                className={`label_icon_old_password ${showCurrentPassword ? 'show' : 'hide'}`}
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            ></span>
                            <span className={`label_icon_check_old_password ${isCurrentPasswordValid ? 'visible' : ''}`}>
                            </span>
                        </label>
                        <label id="label-new-password" className="label_new_password">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="input-new-password"
                                className="input_new_password"
                                placeholder=" "
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span className="label_name_new_password">Nueva Contraseña</span>
                            <span 
                                className={`label_icon_new_password ${showNewPassword ? 'show' : 'hide'}`}
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            ></span>
                            <span className={`label_icon_check_new_password ${isNewPasswordValid ? 'visible' : ''}`}></span>
                        </label>
                        <label className="label_repeat_password">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="input-repeat-password"
                                className="input_repeat_password"
                                placeholder=" "
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                            />
                            <span className="label_name_repeat_password">Repetir Contraseña</span>
                            <span 
                                className={`label_icon_repeat_password ${showConfirmPassword ? 'show' : 'hide'}`}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            ></span>
                            <span className={`label_icon_check_repeat_password ${isConfirmPasswordValid ? 'visible' : ''}`}></span>
                        </label>
                    </div>
                    <div className="field_rules_new_password_popup_configuration">
                        <ul className="field_rules_popup_configuration">
                            <li className={newPassword && /(?=.*[a-z])/.test(newPassword) ? 'pass' : ''}>
                                Una letra minúscula
                            </li>
                            <li className={newPassword && /(?=.*[A-Z])/.test(newPassword) ? 'pass' : ''}>
                                Una letra mayúscula
                            </li>
                            <li className={newPassword && /(?=.*\d)/.test(newPassword) ? 'pass' : ''}>
                                Un número
                            </li>
                            <li className={newPassword && /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(newPassword) ? 'pass' : ''}>
                                Un carácter especial
                            </li>
                            <li className={newPassword && newPassword.length >= 9 ? 'pass' : ''}>
                                Mínimo 9 caracteres
                            </li>
                            <li className={newPassword && newPassword !== currentPassword ? 'pass' : ''}>
                                Distinta de la contraseña anterior
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="container-submit-password" className="container_submit_password">
                    <button
                        id="submit-password"
                        className="button_submit_password"
                        type="submit"
                        disabled={passwordErrors.length > 0}
                    >
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;