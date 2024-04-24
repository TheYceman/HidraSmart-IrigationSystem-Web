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

console.log(process.env.PORT);

const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

let lastActiveTime = {}; // Objeto para almacenar la última vez que se recibió una señal del cliente

io.on('connection', (socket) => {
  console.log('Cliente conectado ');

  socket.on('active', () => {
    console.log('Señal recibida del cliente');
    lastActiveTime[socket.id] = Date.now(); // Registrar el tiempo de la última señal recibida
  });

  socket.on('disconnect', (req, res) => {
    console.log('Cliente desconectado ' );
    delete lastActiveTime[socket.id]; // Eliminar la entrada cuando el cliente se desconecta

  });
});

// Función para verificar la ventana activa
setInterval(() => {
  const currentTime = Date.now();
  Object.keys(lastActiveTime).forEach((clientId) => {
    console.log("currentTime " + currentTime);
    console.log("lastActiveTime " + lastActiveTime[clientId] );
    if (currentTime - lastActiveTime[clientId] > 5000) { // Considerar inactiva si no hay señales durante más de 5 segundos
      console.log(`La ventana del cliente ${clientId} está inactiva`);
    }
  });
}, 1000); // Verificar cada segundo

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});



