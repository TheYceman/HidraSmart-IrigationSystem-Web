const express = require("express");
const loginController = require("../controllers/login.controller");
const emailSender = require('../utils/emailSender');

const router = express.Router();

/************* Soporte del Login *************/

router.get("/contact-us", loginController.getContactUsLogin);

router.get("/change-password", loginController.getChangePasswordLogin);

/********** *********************** **********/

// Ruta para manejar el envío desde el formulario de contacto
router.post('/send-email', async (req, res) => {
    const { token, contactname, contactemail, contactmessage } = req.body;
    const emailSent = await emailSender.sendEmail(token,contactname, contactemail, contactmessage);
    if (emailSent) {
        res.status(200).json({ message: 'Correo electrónico enviado con éxito' });
    } else {
        res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    }
});

module.exports = router;