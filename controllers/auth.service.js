
const initController = require("../controllers/init.controller");
exports.requireLogin = function (req, res, next) {
    //console.log("Auth.service req.session.loggedin " + req.session.loggedin);
    if (req.session.loggedin) {
        next();
    } else {
        //res.send('Acceso no autorizado. Inicia sesión primero.');
        initController.getLogin(req, res);
    }
}
