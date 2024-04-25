const authUtil = require("../utils/auth");
const sessionFlash = require("../utils/session-flash");

const { runQuery } = require("../data/bbdd-connector");

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
      req.session.headCommunityName = 'Pantano Estrecho de Peñarroya';
      req.session.headCommunityImage ='/images/head/argamasilla-de-alba.jpg';
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
