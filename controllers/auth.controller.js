const authUtil = require("../utils/auth");
const sessionFlash = require("../utils/session-flash");


async function login(req, res) {
  const user = { email: req.body.email, password: req.body.password };


  if (!user.email || !user.password) {
    res.send('Por favor, completa ambos campos');
    return;
  }

  const conn = getDb();
  conn.connect(function (err) {
    if (err) {
      conn.destroy();
      reject(err);
    } else {
      conn.query('SELECT * FROM usuarios WHERE login = ?', [user.email], (err, results) => {
        if (err) {
          conn.destroy();
          console.error('Error al buscar el usuario: ' + err.message);
          res.send('Error al buscar el usuario');
          return;
        }
        if (results.length === 0 || results[0].password !== user.password) {
          conn.destroy();
          res.send('Credenciales incorrectas');
        } else {
          conn.destroy();
          req.session.loggedin = true;
          req.session.username = results[0].nombre;
          req.session.idUsuario = user.email;
          req.session.token = user.email;
          //res.send('Inicio de sesión exitoso');

          res.redirect("/panel_aplicaciones");
        }
      });
    }
   
  });

  return;
}

  /*  
  
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
