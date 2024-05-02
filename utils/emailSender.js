// emailSender.js
const nodemailer = require('nodemailer');

// Configuración del transporter
let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'hidrasmarthydraulicinnovation@hotmail.com',
        pass: 'Hidr4l4b'
    }
});

// Función para enviar el correo electrónico
async function sendEmail(token, contactname, contactemail, contactmessage) {
    try {
        let mailOptions = {
            from: 'hidrasmarthydraulicinnovation@hotmail.com',
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

async function verifyCaptcha(username, password, token){
    const credentialsJSON = JSON.parse(fs.readFileSync('./data/intense-emblem-415011-b892b5269f66.json'));//fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, 'utf8'));
    const auth = new GoogleAuth({
        credentials: credentialsJSON,
        scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    let client = new RecaptchaEnterpriseServiceClient({auth});
    const projectID = "intense-emblem-415011";
    const recaptchaKey = "6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX";
    const recaptchaAction = "CONTACT_US";
  
    const projectPath = client.projectPath(projectID);

  // Crea la solicitud de evaluación.
    const request = ({
        assessment: {
            event: {
                token: token,
                siteKey: recaptchaKey,
            },
        },
        parent: projectPath,
    });

    const [ response ] = await client.createAssessment(request);

    
    if (!response.tokenProperties.valid) {
        return null;
    }
    if (response.tokenProperties.action === recaptchaAction) {
        // Obtén la puntuación de riesgo y los motivos.
        // Para obtener más información sobre cómo interpretar la evaluación, consulta:
        // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
        console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
        response.riskAnalysis.reasons.forEach((reason) => {
            console.log(reason);
        });

        const queryString = `SELECT * FROM users WHERE username=? AND password=?;`;
        const values = [username,password];
        const database = 'aplicaciones_web';
        const [results, fields] = await runQuery(queryString, values, database);

        return results;//response.riskAnalysis.score;
    } else {
        console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
        return null;
    }
}

module.exports = { sendEmail };
