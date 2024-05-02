const express = require("express");
const http = require('http');
const configureSocket = require("./middlewares/socket");
//const saveSession = require("./middlewares/session-midleware");
const path = require("path");

const createSession = require("./config/session");

const authMiddleware = require("./middlewares/check-auth");

const initRoutes = require("./routes/init.routes");
const loginRoutes = require("./routes/login.routes");
const navbarRoutes = require("./routes/navbar.routes");
const authRoutes = require("./routes/auth.routes");
const visorDatosRoutes = require("./routes/visor-datos.routes");
const mapaSigRoutes = require("./routes/mapa-sig.routes");

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const app = express();

const faviconPath = 'https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/hidrasmart-Isotipo-positivo.ico'; // Ruta del icono de favicon

app.locals.faviconPath = faviconPath;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionMiddleware = createSession();
app.use(sessionMiddleware);

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

const socketIo = require('socket.io');
const server = http.createServer(app);
const io = configureSocket(server);

// Middleware para Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
  //saveSession(socket.request);
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});



