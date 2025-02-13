// emailSender.js
const nodemailer = require('nodemailer');

const userGmail = process.env.USER_GMAIL;
const passAppGmail = process.env.PASS_APP_GMAIL;

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user:  process.env.USER_GMAIL,
        pass: process.env.PASS_APP_GMAIL,
    },
});


// Función para enviar el correo electrónico
async function sendEmail( contactname, contactemail, contactmessage) {
    try {
        let mailOptions = {
            from: process.env.USER_GMAIL,
            to: contactemail,
            bcc: 'carlos.merino@hidralab.com, hidrasmarthydraulicinnovation@hotmail.com, emilio.ruiz@hidralab.com',
            subject: 'Consulta Irrigation System',
            text: `Nombre: `+contactname+`\nEmail: `+contactemail+`\nMensaje: `+contactmessage
        };
        let info = await transporter.sendMail(mailOptions);
        //console.log('Correo electrónico enviado:', info.response);
        return true;
        // Llama al callback para redirigir después de enviar el correo
        //callback();
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        return false;
    }
}


async function sendEmailNewUser(nombre, email, claveGenerada) {
    const asunto = '¡Bienvenido a nuestra plataforma!';
    const mensajeHTML = `
        <html>
        <head>
            <style>
                /* Aquí puedes agregar estilos CSS para personalizar tu correo */
                body {
                    font-family: "Nunito Sans", sans-serif;
                    color: #009bdb;
                }
                .logo {
                    width: 100px; /* Tamaño del logo */
                }
                /* Puedes definir más estilos según tus necesidades */
            </style>
        </head>
        <body>
            <img src="https://hidrasmart-irrigationsystem.azurewebsites.net/" alt="Irrigation system" class="logo" width="200px"> 
            <p>Hola ${nombre},</p>
            <p>¡Gracias por registrarte en nuestra plataforma!</p>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <p>Su clave de acceso es ${claveGenerada}</p>
            <p>Esperamos que disfrutes de nuestra plataforma y que tengas una excelente experiencia.</p>
            <p>Atentamente,<br/>El equipo de Irrigation System</p>
        </body>
        </html>
    `;
  
    try {
      let mailOptions = {
        from: process.env.USER_GMAIL,
        to: email,
        //bcc: 'emilio.ruiz@hidralab.com',
        subject: asunto,
        text: mensajeHTML
      };
  
      let info = await transporter.sendMail(mailOptions);
      //console.log('Correo electrónico enviado:', info.response);
      return info;
      // Llama al callback para redirigir después de enviar el correo
      //callback();
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      return false;
    }
  
  };

module.exports = { sendEmail, sendEmailNewUser };
