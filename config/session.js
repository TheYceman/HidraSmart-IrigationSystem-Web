const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const fs = require('fs');
const mysql = require("mysql2");

function createSessionStore() {

  const certPath = './config/certificados/DigiCertGlobalRootCA.crt.pem';
  console.log("bbb" + process.cwd())
  const pool = mysql.createPool({
    host: "hidralab-server.mysql.database.azure.com",
    user: "telemedida_alcazar",
    password: "Hidra2023Alcazar",
    port: 3306,
    database: "aplicaciones_web", //"aplicaciones_web"
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: {
      ca: fs.readFileSync(certPath),
    }
  });

  const sessionStore = new MySQLStore({
    // Whether or not to automatically check for and clear expired sessions:
    clearExpired: false,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 90000000,
    // The maximum age of a valid session; milliseconds:
    expiration: 86400000,
    // Whether or not to create the sessions database table, if one does not already exist:
    //createDatabaseTable: true,
    // Whether or not to end the database connection when the store is closed.
    // The default value of this option depends on whether or not a connection was passed to the constructor.
    // If a connection object is passed to the constructor, the default value for this option is false.
    disableTouch: false,
    charset: 'utf8mb4_bin',
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    }
  }, pool);
  // Optionally use onReady() to get a promise that resolves when store is ready.
  sessionStore.onReady().then(() => {
    // MySQL session store ready for use.
    console.log('MySQLStore ready');
  }).catch(error => {
    // Something went wrong.
    console.error(error);
  });

  return sessionStore;
}

function createSession() {
  var offset = new Date().getTimezoneOffset();
  var d = new Date();
  var madridTime = new Date(d.getTime() - (offset * 60 * 1000));
  const expiryDate = new Date(madridTime + 1000 * 60 * 60 * 24 ); // 24 hour
  console.log("createSession " + new Date());
  return session({
    key: "sesion_hidrasmart_IR",
    secret: "session_cookie_secret",
    store: createSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      //secure: true,
      //httpOnly: true,
      //expires: expiryDate
    }
  });
}

module.exports = createSession;
