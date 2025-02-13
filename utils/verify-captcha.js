const fetch = require('node-fetch');

const {RecaptchaEnterpriseServiceClient} = require('@google-cloud/recaptcha-enterprise');

const {GoogleAuth} = require('google-auth-library');


async function verifyCaptcha(token){

    const blobSasUrl = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

    const responseGoogle = await fetch(blobSasUrl);
    const certContentGoogle = await responseGoogle.text();
    
    const auth = new GoogleAuth({
        credentials: JSON.parse(certContentGoogle),
        scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });
    let client = new RecaptchaEnterpriseServiceClient({auth});
    const projectID = "intense-emblem-415011";
    const recaptchaKey = "6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX";
  
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

    
    if (!response.tokenProperties.valid || parseFloat(response.riskAnalysis.score) < 0.3) {
        return null;
    }
    
    // Obtén la puntuación de riesgo y los motivos.
    // Para obtener más información sobre cómo interpretar la evaluación, consulta:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`+parseFloat(response.riskAnalysis.score));
    response.riskAnalysis.reasons.forEach((reason) => {
        console.log(reason);
    });
   
    return {
        success: true,
        message: 'Token validado',
    };
}

module.exports = { verifyCaptcha };