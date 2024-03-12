const authUtil = require("../utils/auth");
const sessionFlash = require("../utils/session-flash");

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

  // authUtil.createUserSession(req, user, function () {
  //   res.redirect("/products");
  // });
  return;
}

module.exports = { login };
