
const initController = require("../controllers/init.controller");
exports.requireLogin = function(req, res, next) {
    alert("requireLogin")
    if (req.session.loggedin) {
        console.log("Sigue el login")
        next();
    } else {
        //res.send('Acceso no autorizado. Inicia sesión primero.');
        initController.getLogin(req, res);
    }
  }
  