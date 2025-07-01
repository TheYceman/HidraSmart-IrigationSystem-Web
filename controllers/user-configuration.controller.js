const { hashatePassword } = require("../config/hashate-password.js");
const { runQuery } = require("../data/bbdd-connector");
const { updateCode } = require("../utils/update-code.js");
const { sendEmail } = require("../utils/emailSender.js");
const { codeRequest } = require("../utils/code-request.js");
const { verifyCaptcha } = require("../config/verify-captcha");
const { verifyUser } = require("../config/verify-user.js");
const { log } = require("../utils/logging.js");

async function switch2FA(req, res) {
    const { token, two_factor_enabled } = req.body;
    //const token = req.session.token
    const email = req.session.user[0].email;
    const idusers = req.session.user[0].idusers;

    // if (!req.body || !email || !req.body.oldPassword || !req.body.newPassword || !req.body.token) {
    //   log.error('Faltan datos en la solicitud');
    //   return res.status(400).json({ success: false, message: 'Faltan datos en la solicitud' });
    // }

    const database = 'hidrasmart_is';

    // if (!token || enable2FA === undefined) {
    //   log.error('Faltan datos en la solicitud');
    //   return res.status(400).json({ success: false, message: 'Faltan datos en la solicitud' });
    // }

    try {
        const captcha = await verifyCaptcha(token);
        if (!captcha) {
            log.warning('Validación de captcha fallida');
            return res.status(400).json({ success: false, message: 'Captcha inválido o no verificado' });
        }

        const queryString = `
      UPDATE users 
      SET two_factor_enabled = ?
      WHERE idusers = ?;
    `;
        const values = [two_factor_enabled ? 0 : 1, idusers];
        const result = await runQuery(queryString, values, database);

        if (result.success) {
            log.success(`Autenticación de doble factor ${two_factor_enabled ? 'activada' : 'desactivada'} para usuario ${email}`);

            // Update session user data
            req.session.user[0].two_factor_enabled = two_factor_enabled ? 0 : 1;

            // Send confirmation email
            //const subject = 'Cambio en la configuración de autenticación de doble factor';
            //const message = `La autenticación de doble factor ha sido ${enable2FA ? 'activada' : 'desactivada'} para su cuenta.`;
            //await sendEmail(email, subject, message);

            return res.status(200).json({
                success: true,
                message: `Autenticación de doble factor ${two_factor_enabled ? 'desactivada' : 'activada'} correctamente`
            });
        } else {
            log.error('Error al actualizar la configuración de 2FA');
            return res.status(500).json({ success: false, message: 'Error al actualizar la configuración' });
        }
    } catch (error) {
        log.error(`Error al procesar cambio de 2FA: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
}

async function checkCodeRequest(req, res) {
    const { sendingemail, sixDigitCode, sendingtype, sendingvalue } = req.body;
    const codeRequestResult = await codeRequest(req);
    if (codeRequestResult.success) {
        if (codeRequestResult.code === hashatePassword(sixDigitCode)) {
            if (sendingtype === 'changeCode') {
                const changeAuthenticationResult = await changeAuthentication.changeAuthentication(sendingemail, sendingvalue);
                res.status(200).json({ success: true, message: 'La verificación es correcta.', validation: true, code: codeRequestResult.code });
            } else if (sendingtype === 'changePassPopupCofiguration' || sendingtype === 'changePassForgotPassword') {
                const changePasswordResult = await changePassword.changePasswordForEmail(sendingemail, sendingvalue);
                if (changePasswordResult) {
                    await sendEmailCode.sendEmailCode(sendingemail, 'Cambio de Contraseña.', "Contraseña actualizada correctamente.");
                    res.status(200).json({ success: true, message: 'La verificación es correcta.', validation: true, code: codeRequestResult.code });
                } else {
                    res.status(200).json({ success: true, message: 'Ha ocurrido un error en el cambio de contraseña.', validation: true, code: codeRequestResult.code });
                }
            } else {
                res.status(200).json({ success: true, message: 'La verificación es correcta.', validation: true, code: codeRequestResult.code });
            }
        } else {
            res.status(200).json({ success: true, message: 'La verificación ha fallado.', validation: false });
        }
    } else {
        res.status(500).json({ error: 'Error al recuperar el código en la DDBB.' });
    }
}

async function getUserDataProv(req, res) {
    if (!req.session || !req.session.loggedin || !req.session.user || !req.session.user[0]) {
        log.error('No hay sesión activa o datos de usuario disponibles');
        return res.status(401).json({ success: false, message: 'No hay sesión activa' });
    }

    // const { username, email, idusers } = req.session.user[0];
    // const database = 'hidrasmart_is';
    // const queryString = `
    //   SELECT username, email, doubleauthentication AS two_factor_enabled, changecode, idusers 
    //   FROM users 
    //   WHERE idusers = ?;
    // `;
    // const values = [idusers];

    try {
        // const result = await runQuery(queryString, values, database);
        // if (result.success && result.data.rows.length > 0) {
        //   const userData = result.data.rows[0];
        //   const sessionData = {
        //     headImage: req.session.headImage,
        //     headCommunityName: req.session.headCommunityName,
        //     headCommunityImage: req.session.headCommunityImage,
        //     headCommunityUrl: req.session.headCommunityUrl,
        //     sessionToken: req.session.token
        //   };

        return res.status(200).json({
            success: true,
            user: {
                ...req.session.user,
                networks: req.session.user.networks,
                selectedbbdd: req.session.user.ddbbSelected,
                targetLongitude: req.session.targetLongitude,
                targetLatitude: req.session.targetLatitude,
                targetZoom: req.session.targetZoom
            }
        });


    } catch (error) {
        log.error(`Error al obtener datos del usuario: ${error.message}`);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
}

async function sendVerificationCode(req, res) {
    const { sendingemail, sendingsubject } = req.body;
    let { sendingmessage } = req.body;
    const updateCodeResult = await updateCode(req);
    if (updateCodeResult.success) {
        const sixDigitCode = updateCodeResult.code;
        sendingmessage = `${sendingmessage} Su código de verificación es: ${sixDigitCode}`;
        req.body.sendingmessage = sendingmessage;
        const emailSent = await sendEmail(sendingemail, sendingsubject, sendingmessage);
        if (emailSent) {
            res.status(200).json({ success: true, message: 'Código grabado correctamente en la DDBB y correo electrónico enviado con éxito' });
        } else {
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        }
    } else {
        res.status(500).json({ error: 'Error al grabar el código en la DDBB.' });
    }

}

async function checkPassword(req, res) {

    const queryString = `SELECT * FROM users WHERE username=? AND password=?;`;
    const values = [req.body.username, hashatePassword(req.body.oldPassword)];
    const database = 'hidrasmart_is';
    try {
        const result = (await runQuery(queryString, values, database)).data.rows.length > 0;
        if (result) {
            res.status(200).json({
                success: true,
            });
        } else {
            res.status(401).json({
                success: false,
            });
        }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
    return false;
}

async function confirmPassword(username, oldPassword, newPassword, codeVerification) {
    try {
        // if (result.success) {
        //     const rows = result.data.rows;
        //     if (rows.length > 0) {
        //         if (rows[0].doubleauthentication === 0 || rows[0].changecode === codeVerification) {
        await setNewPassword(username, newPassword);
        return true;
        //             return true;
        //         } else {
        //             throw new Error('Código de verificación incorrecto');
        //         }
        //     } else {
        //         throw new Error('La antigua contraseña es incorrecta');
        //     }
        // } else {
        //     console.error('Error al ejecutar la consulta:', result.message);
        //     throw new Error('Error interno del servidor');
        // }
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        throw error;
    }
}

async function setNewPassword(username, newPassword) {
    const hashedNewPassword = hashatePassword(newPassword);
    const queryString = `UPDATE users SET password=? WHERE username=?;`;
    const values = [hashedNewPassword, username.username];
    const database = 'hidrasmart_is';

    try {
        const result = await runQuery(queryString, values, database);
        if (result.success) {
            console.log(`Contraseña actualizada para el usuario: ${username}`);
            return true;
        } else {
            console.error('Error al actualizar la contraseña:', result.message);
            throw new Error('Error al actualizar la contraseña');
        }
    } catch (error) {
        console.error('Error al ejecutar la actualización de la contraseña:', error);
        throw new Error('Error interno del servidor al actualizar la contraseña');
    }
}

// async function checkPassword(useremail, oldPassword) {
//   const queryString = `SELECT password FROM users WHERE email=?;`;
//   const values = [useremail];
//   const database = 'hidrasmart_is';

//   try {
//     const result = await runQuery(queryString, values, database);
//     if (result.success) {
//       console.log(result.data.rows[0].password);
//       if (result.data.rows[0].password === hashatePassword(oldPassword)) {
//         return true;
//       } else {
//         return false;
//       }
//     } else {
//       console.error('Error al actualizar la contraseña:', result.message);
//       return res.status(500).json({
//         status: 500,
//         message: "Error al actualizar la contraseña"
//       });
//     }
//   } catch (error) {
//     console.error('Error al ejecutar la actualización de la contraseña:', error);
//     return res.status(500).json({
//       status: 500,
//       message: "Error interno del servidor al actualizar la contraseña"
//     });
//   }
// }

async function changePassword(req, res) {
    const { newPassword, token, oldPassword, codeVerification } = req.body;

    const email = req.session.user[0].email;
    const username = req.session.user[0];

    if (!req.body || !email || !req.body.oldPassword || !req.body.newPassword || !req.body.token) {
        log.error('Faltan datos en la solicitud');
        return res.status(400).json({ success: false, message: 'Faltan datos en la solicitud' });
    }

    try {
        const captcha = await verifyCaptcha(token);
        log.info(`Resultado verificación captcha: ${captcha ? 'Válido' : 'Inválido'}`);

        if (!captcha) {
            log.warning('Validación de captcha fallida');
            return res.status(400).json({ success: false, message: 'Captcha inválido o no verificado' });
        }
        const user = await verifyUser(username.username, oldPassword);

        if (!user) {
            log.error('Credenciales inválidas para el usuario');
            return res.status(401).json({ success: false, message: 'Email y/o contraseña actual no son válidos' });
        }

        // if (username.two_factor_enabled === 1) {
        //   const sendingemail = email;
        //   const sendingsubject = 'Código de verificación';
        //   const sendingmessage = 'Cambio de contraseña.';

        //   const resultCheckPassword = await checkPassword(sendingemail, oldPassword);
        //   if (resultCheckPassword) {
        //     let resultChangeCodeRequest;
        //     try {
        //       resultChangeCodeRequest = await showMessageCodeRequest(userEmail, 'changePassPopupCofiguration', newPassword);
        //     } catch (error) {
        //       console.error('Error al enviar el correo electrónico:', error);
        //     }

        //     if (resultChangeCodeRequest) {
        //       try {
        //         popupSessionClosed(false);
        //       } catch (error) {
        //         console.error('Error al enviar el correo electrónico:', error);
        //       }
        //     }
        //   } else {
        //   }
        // } else {
        //   try {
        //     resultChangePassword = await changePassword(oldPassword, newPassword);
        //   } catch (error) {
        //     console.error('Error al cambiar la contraseña:', error);
        //   }
        // }

        await confirmPassword(username, oldPassword, newPassword, codeVerification);

        log.success(`Contraseña actualizada exitosamente para usuario ${username}`);
        return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        log.error(`Error al procesar cambio de contraseña: ${error.message}`);
        return res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }

}

module.exports = { changePassword, getUserDataProv, sendVerificationCode, checkCodeRequest, switch2FA, checkPassword }