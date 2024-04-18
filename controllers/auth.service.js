
const initController = require("../controllers/init.controller");
exports.requireLogin = function(req, res, next) {
    console.log("requireLogin")
    if (req.session.loggedin) {
        console.log("Sigue el login")
        next();
    } else {
        //res.send('Acceso no autorizado. Inicia sesión primero.');
        initController.getLogin(req, res);
    }
  }
  