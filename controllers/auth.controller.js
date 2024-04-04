const authUtil = require("../utils/auth");
const sessionFlash = require("../utils/session-flash");

const { runQuery } = require("../data/bbdd-connector");

async function verifyUser(username, password, req) {

  const queryString = `SELECT * FROM users WHERE username='${username}' AND password='${password}';`;
  const results = await runQuery(queryString);
  return results;

}

async function login(req, res) {
  console.log('Entra en Login ' + req.sessionID);
  try {
    const { username, password, token } = req.body;

    let resultLogin = await verifyUser(username, password, req);

    if (!resultLogin) {
      res.status(401).json({ success: false, message: 'Email y/o contraseña no son válidos' });
    } else {

      const session_id = req.sessionID;
      const idusers = resultLogin[0].idusers;
      const start_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const end_time = '1999-01-01 00:00';

      const inserta = await runQuery(`INSERT INTO session_logs (session_id, idusers, start_time, end_time) VALUES ('${session_id}', '${idusers}', '${start_time}', '${end_time}');`);
      console.log("async function login " + inserta);
      console.log(" resultLogin BBDD OK " + resultLogin[0].username);
      req.session.loggedin = true;
      req.session.username = resultLogin[0].username;
      req.session.idUsuario = idusers;
      req.session.token = username;
      req.session.headImage = '/images/login/US-positivo-horizontal.png';
      res.status(200).json({ success: true, route: '/panel_aplicaciones' });
    }
  } catch (error) {
    console.error("Error al conectar a MySQL:", error);
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
