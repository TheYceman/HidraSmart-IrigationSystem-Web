
const navbarController = require("../controllers/navbar.controller");
exports.requireLogin = function(req, res, next) {
    console.log("exports.requireLogin " + req.session.loggedin);
    if (req.session.loggedin) {
        next();
    } else {
        //res.send('Acceso no autorizado. Inicia sesión primero.');
        navbarController.getLogin(req, res);
    }
  }
  