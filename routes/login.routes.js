const express = require("express");
const loginController = require("../controllers/login.controller");
const { verifyCaptcha } = require('../utils/verify-captcha');
const emailSender = require('../utils/emailSender');

const router = express.Router();

/************* Soporte del Login *************/

router.get('/landing-page', (req, res) => {
    res.render('landing-page');
});

router.get("/contact-us", loginController.getContactUsLogin);

router.get("/change-password", loginController.getChangePasswordLogin);

/********** *********************** **********/

// Ruta para manejar el envío desde el formulario de contacto
router.post('/send-email', async (req, res) => {
    const { token, contactname, contactemail, contactmessage } = req.body;

    // Validar que el token esté presente
    if (!token) {
        return res.status(400).json({ 
            success: false, 
            message: "Falta el token en la solicitud."
        });
    }

    try {
        // Verificar el token con la función verifyCaptcha
        const result = await verifyCaptcha(token);

        if (!result || !result.success) {
            console.error('Token inválido. Detalles:', result?.['error-codes'] || 'No disponible');
            return res.status(400).json({ 
                success: false, 
                message: `Error: Token inválido. Detalles: ${result?.['error-codes'] || 'No disponible'}` 
            });
        }

        // Intentar enviar el correo
        const emailSent = await emailSender.sendEmail( contactname, contactemail, contactmessage);
        
        if (emailSent) {
            return res.status(200).json({ success: true, message: 'Correo electrónico enviado con éxito' });
        } else {
            return res.status(500).json({ success: false, error: 'Error al enviar el correo electrónico' });
        }

    } catch (error) {
        console.error('Error en el proceso de envío de correo:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor al enviar el correo electrónico.'
        });
    }
});

module.exports = router;