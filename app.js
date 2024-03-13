const path = require("path");

const express = require("express");

// const createSession = require("./config/session");
// const authMiddleware = require("./middlewares/check-auth");

const initRoutes = require("./routes/init.routes");
const loginRoutes = require("./routes/login.routes");
const navbarRoutes = require("./routes/navbar.routes");
const authRoutes = require("./routes/auth.routes");
const visorDatosRoutes = require("./routes/visor-datos.routes");

const app = express();
const session = require('express-session');

const faviconPath = 'https://cdn.jsdelivr.net/gh/HidralabIyD/HidraSmart-CommonFiles@latest/icon/hidrasmart-Isotipo-positivo.ico'; // Ruta del icono de favicon

app.locals.faviconPath = faviconPath;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  headImage: '',
}));

// app.use(createSession());
// app.use(authMiddleware);

app.use("/", initRoutes);
app.use("/", loginRoutes);
app.use("/", navbarRoutes);
app.use("/", authRoutes);
app.use("/visor-datos", visorDatosRoutes);

app.use(function (error, req, res, next) {
  res
    .status(500)
    .render("errors/500", { error: error, navIndex: -1, navGroup: -1 });
});

app.listen(process.env.PORT || 3002);
