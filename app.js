const path = require("path");

const express = require("express");

const createSession = require("./config/session");
const authMiddleware = require("./middlewares/check-auth");

const navbarRoutes = require("./routes/navbar.routes");
const authRoutes = require("./routes/auth.routes");
const visorDatosRoutes = require("./routes/visor-datos.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(createSession());
app.use(authMiddleware);

app.use("/", navbarRoutes);
app.use("/", authRoutes);
app.use("/visor-datos", visorDatosRoutes);

app.use(function (error, req, res, next) {
  res
    .status(500)
    .render("errors/500", { error: error, navIndex: -1, navGroup: -1 });
});

app.listen(process.env.PORT || 3000);
