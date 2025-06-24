// auth.controller.react.js

const { verifyCaptcha } = require("../config/verify-captcha");
const { verifyUser } = require("../config/verify-user");
const { insertSessionLog } = require("./session.controller");
const { runQuery } = require("../data/bbdd-connector");

async function loginReact(req, res) {
  console.log("Procesando login React...");
  if (!req.body || !req.body.username || !req.body.password || !req.body.token) {
    return res.status(400).json({ success: false, message: "Faltan datos en la solicitud" });
  }

  try {

    const { username, password, token } = req.body;
    const captcha = await verifyCaptcha(token);

    console.log("Captcha verificado:", captcha);

    if (!captcha) {
      return res.status(400).json({ success: false, message: "Captcha inválido o no verificado" });
    }
    const user = await verifyUser(username, password);

    if (!user) {
      return res.status(401).json({ success: false, message: "Email y/o contraseña no son válidos" });
    }
    console.log("Usuario verificado:", user);
    req.session.loggedin = true;
    req.session.user = [user];
    req.session.token = req.sessionID;
    req.session.headImage = "/images/login/IS-positivo-horizontal.png";
    req.session.headCommunityName = "Estrecho de Peñarroya";
    req.session.headCommunityImage = "/images/head/argamasilla-de-alba.png";
    req.session.headCommunityUrl = "https://www.crpenarroya.org/";
    process.env.USER_SESSION = JSON.stringify(req.session.userSession);

    if (user.idusers) {
      insertSessionLog(req.sessionID, user.idusers);
    } else {
      console.error("Falta idusers para insertar en logs de sesión.");
    }

    return res.status(200).json({ success: true, route: "/panel-aplicaciones" });
  } catch (error) {
    console.error("Error al procesar login:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getNombreUsuarioById(req, res) {
  const idUsuario = req.params.id;

  try {
    const query = "SELECT idusers, username FROM users WHERE idusers = ?";
    const results = await runQuery(query, [idUsuario], "hidrasmart_is");

    const filas = results?.data?.rows;

    if (!Array.isArray(filas) || filas.length === 0) {
      return res.json({ id: idUsuario, username: "Usuario no encontrado" });
    }

    const user = filas[0];
    return res.json({ id: user.idusers, username: user.username });
  } catch (error) {
    console.error("Error al obtener nombre de usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = { loginReact, getNombreUsuarioById };
