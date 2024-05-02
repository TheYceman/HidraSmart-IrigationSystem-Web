
const fetch = require('node-fetch');
const {RecaptchaEnterpriseServiceClient} = require('@google-cloud/recaptcha-enterprise');

const {GoogleAuth} = require('google-auth-library');

const { runQuery } = require("../data/bbdd-connector");


async function verifyCaptcha(username, password, token){
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

    const [ response ] = await client.createAssessment(request);

    
    if (!response.tokenProperties.valid || parseFloat(response.riskAnalysis.score) < 0.3) {
        return null;
    }
    if (response.tokenProperties.action === recaptchaAction) {
        // Obtén la puntuación de riesgo y los motivos.
        // Para obtener más información sobre cómo interpretar la evaluación, consulta:
        // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
        console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`+parseFloat(response.riskAnalysis.score));
        response.riskAnalysis.reasons.forEach((reason) => {
            console.log(reason);
        });
        const queryString = `SELECT * FROM users WHERE username=? AND password=?;`;
        const values = [username, password];
        const database = 'hidrasmart_pn';
        
        try {
            const result = await runQuery(queryString, values, database);
        
            if (result.success) {
                const rows = result.data.rows;
                return rows;
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


async function verifyUser(username, password, req) {

  const queryString = `SELECT * FROM users WHERE username='${username}' AND password='${password}';`;
  const results = await runQuery(queryString);
  return results;

}

async function login(req, res) {
  console.log('Entra en Login ' + req);
  try {
    const { username, password, token } = req.body;

    let resultLogin = await verifyUser(username, password, req);

    if (resultLogin[0] == undefined) {
      res.status(401).json({ success: false, message: 'Email y/o contraseña no son válidos' });
    } else {

      const session_id = req.sessionID;
      const idusers = resultLogin[0].idusers;
      var offset = new Date().getTimezoneOffset();
      var d = new Date();
      var madridTime = new Date(d.getTime() - (offset * 60 * 1000));
      const start_time = madridTime.toISOString().slice(0, 19).replace('T', ' ');
      const end_time = '1999-01-01 00:00';

      const inserta = await runQuery(`INSERT INTO session_logs (session_id, idusers, start_time, end_time, aplicacion) VALUES ('${session_id}', '${idusers}', '${start_time}', '${end_time}', "Irrigation");`);
      req.session.user = resultLogin;
      console.log("async function login " + inserta);
      console.log(" resultLogin BBDD OK " + resultLogin[0].user);
      req.session.loggedin = true;
      req.session.username = resultLogin[0].username;
      req.session.idUsuario = idusers;
      req.session.token = username;
      req.session.headImage = '/images/login/IS-positivo-horizontal.png';
      req.session.headCommunityName = 'Estrecho de Peñarroya';
      req.session.headCommunityImage ='/images/head/argamasilla-de-alba.png';
      req.session.headCommunityUrl = 'https://www.crpenarroya.org/';

      console.log("¿Porque no redirige?");
      console.log(" Login req.session.loggedin " + req.session.loggedin);
      res.status(200).json({ success: true, route: '/panel_aplicaciones' });
    }
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ error: 'Error al conectar a MySQL' });
  }
}

/*   req.session.headImage 
 
async function login(req, res) {
  const user = { email: req.body.email, password: req.body.password };
 
  sessionFlash.flashDataToSession(
    req,
    {
      idUsuario: "id de la sesion",
      token: "token test",
    },
    function () {
      res.redirect("/");
    }
  );
 
  return;
}
 
*/
module.exports = { login };
