
const { insertSessionLog } = require("../controllers/session.controller");

const fetch = require('node-fetch');
const { RecaptchaEnterpriseServiceClient } = require('@google-cloud/recaptcha-enterprise');

const { GoogleAuth } = require('google-auth-library');

const { runQuery } = require("../data/bbdd-connector");

const { compare } = require("../helpers/handleBcrypt");


async function verifyCaptcha(username, password, token) {
  const blobSasUrl = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

  const responseGoogle = await fetch(blobSasUrl);
  const certContentGoogle = await responseGoogle.text();

  const auth = new GoogleAuth({
    credentials: JSON.parse(certContentGoogle),
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  let client = new RecaptchaEnterpriseServiceClient({ auth });
  const projectID = "intense-emblem-415011";
  const recaptchaKey = "6Lf3o3opAAAAAH0GHlp_LuajXdK_Ur8HCR8_vLqX";
  const recaptchaAction = "LOGIN";

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

  const [response] = await client.createAssessment(request);


  if (!response.tokenProperties.valid || parseFloat(response.riskAnalysis.score) < 0.3) {
    return null;
  }
  if (response.tokenProperties.action === recaptchaAction) {
    // Obtén la puntuación de riesgo y los motivos.
    // Para obtener más información sobre cómo interpretar la evaluación, consulta:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}` + parseFloat(response.riskAnalysis.score));
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });
    const queryString = `SELECT * FROM users WHERE username=?;`;
    const values = [username];
    const database = 'aplicaciones_web';

    try {
      const result = await runQuery(queryString, values, database);

      if (result.success) {
        const rows = result.data.rows;
        console.log("rows.password " + result.data.rows[0].password);
        if (compare(password, result.data.rows[0].password)) {
          return rows;
        }

      } else {
        console.error('Error al ejecutar la consulta:', result.message);
        // Maneja el caso de error según sea necesario
      }
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      // Maneja el error lanzado por la función runQuery
      throw error;
    }
  } else {
    console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
    return null;
  }
}

async function login(req, res) {
  try {
    const { username, password, token } = req.body;

    let resultLogin = await verifyCaptcha(username, password, token);

    if (!resultLogin || resultLogin.length === 0) {
      res.status(401).json({ success: false, message: 'Email y/o contraseña no son válidos' });
    } else {
      // Verificación exitosa, configurar la sesión del usuario
      req.session.loggedin = true;
      req.session.user = resultLogin;
      req.session.token = req.sessionID;
      req.session.headImage = '/images/login/IS-positivo-horizontal.png';
      req.session.headCommunityName = 'Estrecho de Peñarroya';
      req.session.headCommunityImage = '/images/head/argamasilla-de-alba.png';
      req.session.headCommunityUrl = 'https://www.crpenarroya.org/';
      process.env.USER_SESSION = JSON.stringify(req.session.userSession);

      const sessionData = {
        cookie: req.session.cookie,
        headImage: req.session.headImage
      };

      if (req.session.user[0].idusers) {
        insertSessionLog(req.sessionID, req.session.user[0].idusers, "irrigation");
      } else {
        console.error('Alguno de los valores necesarios para insertar la sesión es undefined.');
      }
      res.status(200).json({ success: true, route: '/panel_aplicaciones' });
    }
  } catch (error) {
    console.error("Error al conectar a MySQL:", error);
    res.status(500).json({ error: 'Error al conectar a MySQL' });
  }
}

function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      res.status(500).json({ error: 'Error interno del servidor al cerrar sesión' });
    } else {
      // La sesión se ha cerrado correctamente
      console.log('Sesión cerrada');
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    }
  });
}

module.exports = { login, logout };
module.exports = { login };
