if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const configureSocket = require("./middlewares/socket");
const saveSession = require("./middlewares/session-midleware");
const createSession = require("./config/session");
const authMiddleware = require("./middlewares/check-auth");

// Rutas
const initRoutes = require("./routes/init.routes");
const authRoutes = require("./routes/auth.routes");
const applicationPanelRoutes = require("./routes/application-panel.routes");
// const gestionLecturasRoutes = require("./routes/gestion-lecturas.routes");

const app = express();

// 1. Middleware global
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 2. Sesiones
const sessionMiddleware = createSession();
app.use(sessionMiddleware);

// 3. Socket.io con acceso a la sesión
const server = http.createServer(app);
const io = configureSocket(server);
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
  saveSession(socket.request);
});

// ✅ Esta ruta es pública, asegúrate que initRoutes tenga `router.get("/")`
app.use("/api", initRoutes);
app.use("/api", authRoutes);

// 5. Middleware de autenticación para rutas privadas
app.use(authMiddleware);

app.use("/api", applicationPanelRoutes);
// app.use("/api", gestionLecturasRoutes);

// 6. Archivos estáticos del frontend
const frontendDistPath = path.join(__dirname, "frontend", "public", "dist");

if (!fs.existsSync(path.join(frontendDistPath, "index.html"))) {
  console.warn("⚠️  frontend/dist/index.html no encontrado. ¿Ejecutaste npm run build en frontend?");
}
app.use(express.static(frontendDistPath));

// 7. SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// 8. Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Error interno" });
});

// 9. Inicio del servidor
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
