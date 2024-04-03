const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const fs = require('fs');
const mysql = require("mysql2");


function createSessionStore() {

  const certPath = './config/certificados/DigiCertGlobalRootCA.crt.pem';
  console.log("bbb" + process.cwd())
  const dbConfig = {
    host: "hidralab-server.mysql.database.azure.com",
        user: "telemedida_alcazar",
        password: "Hidra2023Alcazar",
        port: 3306,
        database: "aplicaciones_web",
        connectTimeout : 1000000,
        waitForConnections : true,
        queueLimit : 0,
        ssl : {
          ca : fs.readFileSync(certPath),
      }
  };

  const connection = mysql.createConnection(dbConfig);

  connection.connect((error)=>{
    if (error){
        console.log("Error " + error);
        connection = mysql.createConnection(dbConfig);
        createSession();
    } else {
        console.log("Connected..")
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
      endConnectionOnClose: true,
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
  }, connection);
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
  const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 hour
  console.log(session);
  return session({
    key: "sesion_hidrasmart_IR",
    secret: "session_cookie_secret",
    store: createSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      //secure: true,
      //httpOnly: true,
      expires: expiryDate      
    }
  });
}

module.exports = createSession;
