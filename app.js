const path = require("path");

const express = require("express");

const createSession = require("./config/session");
const authMiddleware = require("./middlewares/check-auth");

const initRoutes = require("./routes/init.routes");
const loginRoutes = require("./routes/login.routes");

const navbarRoutes = require("./routes/navbar.routes");
const authRoutes = require("./routes/auth.routes");
const visorDatosRoutes = require("./routes/visor-datos.routes");
const mapaSigRoutes = require("./routes/mapa-sig.routes");

const app = express();

const http = require('http');
//const session = require('express-session');

const faviconPath = 'https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/hidrasmart-Isotipo-positivo.ico'; // Ruta del icono de favicon

app.locals.faviconPath = faviconPath;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(createSession());
app.use(authMiddleware);

app.use("/", initRoutes);
app.use("/", authRoutes);
app.use("/", loginRoutes);
app.use("/", navbarRoutes);

app.use("/visor-datos", visorDatosRoutes);
app.use("/mapa-sig", mapaSigRoutes);

var Auth = require('./controllers/auth.service');
app.use(function (error, req, res, next) {
  if (req.session) {
    console.log("req.session" + req.session);
    req.session.init = "init";
  }
  else {
    Auth.requireLogin
  }

  res
    .status(500)
    .render("errors/500", { error: error, navIndex: -1, navGroup: -1 });
  next();
});

// Esta función se ejecutará cuando el proceso de Node.js esté a punto de terminar
process.on('beforeExit', () => {
  
  console.log("Se ejecuta beforeExit en app.js");
  // Realiza una solicitud al servidor para indicar que el usuario está cerrando la ventana
  const options = {
    hostname: 'localhost', // Cambia esto por la dirección del servidor
    port: 3000, // Cambia esto por el puerto del servidor
    path: '/logout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status de la solicitud: ${res.statusCode}`);
  });

  req.on('error', (error) => {
    console.error(`Error en la solicitud: ${error}`);
  });

  req.end();
});

app.listen(process.env.PORT || 3002);


