const authUtil = require("../utils/auth");
const sessionFlash = require("../utils/session-flash");

const { getDb, runQuery } = require("../data/bbdd-connector");

async function verifyUser(username, password){
  const conn = getDb();
  
  const  queryString = `SELECT * FROM users WHERE username='${username}' AND password='${password}';`;
  const [results, fields] = await runQuery(queryString);
  return results;
}

async function login(req, res) {
  console.log('Entra en Login');
  try{
      const { username, password, token} = req.body;
      
      let resultLogin = await verifyUser(username, password, req);
      
      // console.log(resultLogin);
      if (!resultLogin) {
          res.status(401).json({ success: false , message: 'Email y/o contraseña no son válidos' });
      } else {
          res.status(200).json({ success: true, route: '/panel_aplicaciones' });
      }
  } catch (error) {
      console.error("Error al conectar a MySQL:", error);
      res.status(500).json({ error: 'Error al conectar a MySQL' });
  }
}

async function verifyUser2(username, password) {
  // const user = { username: req.body.username, password: req.body.password };


  // if (!username || !password) {
  //   res.send('Por favor, completa ambos campos');
  //   return;
  // }

  const conn = getDb();
  conn.connect(function (err) {
    if (err) {
      conn.destroy();
      reject(err);
    } else {
      conn.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
          conn.destroy();
          console.error('Error al buscar el usuario: ' + err.message);
          res.send('Error al buscar el usuario');
          return;
        }
        if (results.length === 0 || results[0].password !== password) {
          conn.destroy();
          res.send('Credenciales incorrectas');
        } else {
          conn.destroy();
          req.session.loggedin = true;
          req.session.username = results[0].nombre;
          req.session.idUsuario = username;
          req.session.token = username;
          //res.send('Inicio de sesión exitoso');
          return true;
          // res.status(200).json({ success: true, route: '/panel_aplicaciones' });
          // res.redirect("/panel_aplicaciones");
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
