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

const dotenv = require('dotenv').config();

const app = express();

//app.use(createSession());
// Configuración de express-session
const sessionMiddleware = createSession();
const configureSocket = require("./middlewares/socket");
app.use(sessionMiddleware);
const http = require('http');
const server = http.createServer(app);
const io = configureSocket(server);
//const session = require('express-session');

const { runQuery } = require("./data/bbdd-connector");

const faviconPath = 'https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/hidrasmart-Isotipo-positivo.ico'; // Ruta del icono de favicon

app.locals.faviconPath = faviconPath;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// Middleware para Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

// Hacer que io esté disponible globalmente
app.set("io", io);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});



