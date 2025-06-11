const fetch = require("node-fetch");
const { RecaptchaEnterpriseServiceClient } = require("@google-cloud/recaptcha-enterprise");
const { GoogleAuth } = require("google-auth-library");

async function verifyCaptcha(token) {
    const blobSasUrl = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const responseGoogle = await fetch(blobSasUrl);
    const certContentGoogle = await responseGoogle.text();

    const auth = new GoogleAuth({
        credentials: JSON.parse(certContentGoogle),
        scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    const client = new RecaptchaEnterpriseServiceClient({ auth });
    const projectID = "intense-emblem-415011";
    const recaptchaKey = "6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX";
    const recaptchaAction = "login";

    const projectPath = client.projectPath(projectID);

    const request = {
        assessment: {
        event: {
            token: token,
            siteKey: recaptchaKey,
        },
        },
        parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    if (!response.tokenProperties.valid || parseFloat(response.riskAnalysis.score) < 0.3) {
        return false;
    }
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}` + parseFloat(response.riskAnalysis.score));
    return true;
}

async function verifyEmail(email) {
    try {
        const users = await User.findAll({
            attributes: [
                'idusers',
                'username',
                'name',
                'surname',
                'email',
            ],
            where: {
                email: email,
            },
            raw: true,
        });

        return users;
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return [];
    }
}

function hashatePassword(password){
    const crypto = require('crypto');
    return crypto.createHash('sha3-512').update(password).digest("hex");
};

module.exports = { verifyCaptcha, verifyEmail };