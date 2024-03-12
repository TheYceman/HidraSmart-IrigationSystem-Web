const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

function createSessionStore() {
  const options = {
    host: "adif-server.mysql.database.azure.com",
    user: "Iago@adif-server",
    password: "hidra22Azure23",
    port: 3306,
    database: "aplicaciones_web",
    createDatabaseTable: false,
    schema: {
      tableName: "sesiones_hidrasmart_regantes",
      columnNames: {
        session_id: "sesion",
        expires: "expires",
        data: "data",
      },
    },
  };

  const sessionStore = new MySQLStore(options);
  return sessionStore;
}

function createSession() {
  return session({
    key: "sesion_hidrasmart_regantes",
    secret: "session_cookie_secret",
    store: createSessionStore(),
    resave: false,
    saveUninitialized: false,
  });
}

module.exports = createSession;
