const { verifyCaptcha } = require("../config/verify-captcha");
const { verifyUser } = require("../config/verify-user");
const { insertSessionLog } = require("./session.controller");
const { getUserLocationOption } = require('../utils/location-manager');

async function loginReact(req, res) {
  // Validate request body
  if (!req.body?.username || !req.body?.password || !req.body?.token) {
    return res.status(400).json({ success: false, message: "Faltan datos en la solicitud" });
  }

  try {
    const { username, password, token } = req.body;

    // Verify CAPTCHA
    const captcha = await verifyCaptcha(token);
    if (!captcha) {
      return res.status(400).json({ success: false, message: "Captcha inválido o no verificado" });
    }

    // Verify user credentials
    const user = await verifyUser(username, password);
    if (!user) {
      return res.status(401).json({ success: false, message: "Email y/o contraseña no son válidos" });
    }

    console.log("Usuario verificado:", user);

    // Set session data
    req.session.loggedin = true;
    req.session.user = [user];
    req.session.token = req.sessionID;
    req.session.headImage = "/images/login/IS-positivo-horizontal.png";
    req.session.headCommunityName = "Estrecho de Peñarroya";
    req.session.headCommunityImage = "/images/head/argamasilla-de-alba.png";
    req.session.headCommunityUrl = "https://www.crpenarroya.org/";
    process.env.USER_SESSION = JSON.stringify(req.session.userSession);

    // Get user location
    const location = await getUserLocationOption(req, res);
    // Ensure getUserLocationOption does not send a response
    if (res.headersSent) {
      console.error("Headers already sent in getUserLocationOption");
      return;
    }

    // Log session if user ID exists
    if (user.idusers) {
      await insertSessionLog(req.sessionID, user.idusers);
    } else {
      console.warn("Falta idusers para insertar en logs de sesión.");
    }

    // Send final response
    return res.status(200).json({ success: true, route: "/panel-aplicaciones" });
  } catch (error) {
    console.error("Error al procesar login:", error);
    // Avoid sending response if headers are already sent
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }
}

module.exports = { loginReact };
