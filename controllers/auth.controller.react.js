// auth.controller.react.js

const { verifyCaptcha } = require("../config/verify-captcha");
const { verifyUser } = require("../config/verify-user");
const { insertSessionLog } = require("./session.controller");


const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (message) => console.log(`${colors.blue}[INFO]${colors.reset} ${message}`),
  success: (message) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`),
  warning: (message) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`),
  error: (message) => console.error(`${colors.red}[ERROR]${colors.reset} ${message}`),
  debug: (message) => console.log(`${colors.cyan}[DEBUG]${colors.reset} ${message}`)
};

async function changePassword(req, res) {

  log.info('Iniciando proceso de cambio de contraseña...');

  if (!req.body || !req.session.email || !req.body.oldPassword || !req.body.newPassword || !req.body.token) {
    log.error('Faltan datos en la solicitud');
    return res.status(400).json({ success: false, message: 'Faltan datos en la solicitud' });
  }

  try {
    const { email, oldPassword, newPassword, token } = req.body;
    
    log.debug(`Procesando cambio de contraseña para: ${email}`);
    
    const captcha = await verifyCaptcha(token);
    log.info(`Resultado verificación captcha: ${captcha ? 'Válido' : 'Inválido'}`);

    if (!captcha) {
      log.warning('Validación de captcha fallida');
      return res.status(400).json({ success: false, message: 'Captcha inválido o no verificado' });
    }

    // Verificar usuario con email y contraseña antigua
    const user = await verifyUser(email, oldPassword);
    
    if (!user) {
      log.error('Credenciales inválidas para el usuario');
      return res.status(401).json({ success: false, message: 'Email y/o contraseña actual no son válidos' });
    }
    
    log.debug(`Usuario verificado: ${user.idusers}`);

    // Validar la nueva contraseña
    if (newPassword.length < 3) {
      log.warning('La nueva contraseña no cumple con los requisitos de longitud');
      return res.status(400).json({ success: false, message: 'La nueva contraseña debe tener al menos 3 caracteres' });
    }

    // Actualizar la contraseña
    const updated = await updateUserPassword(user.idusers, newPassword);
    
    if (!updated) {
      log.error('Fallo al actualizar la contraseña en la base de datos');
      return res.status(500).json({ success: false, message: 'No se pudo actualizar la contraseña' });
    }

    log.success(`Contraseña actualizada exitosamente para usuario ${user.idusers}`);
    return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    log.error(`Error al procesar cambio de contraseña: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}

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

module.exports = { loginReact, changePassword};
