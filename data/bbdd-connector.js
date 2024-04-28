const mysql = require("mysql2/promise");
const fs = require('fs');

const certPath = './config/certificados/DigiCertGlobalRootCA.crt.pem';

async function getDb(ddbb) {

  console.log("bbb" + process.cwd());

  try {

    // Create the connection pool. The pool-specific settings are the defaults
    const pool = mysql.createPool({
      host: process.env.AZURE_MYSQL_HOST,
      user: process.env.AZURE_MYSQL_USER,
      password: process.env.AZURE_MYSQL_PASSWORD,
      port: process.env.AZURE_MYSQL_PORT,
      database: ddbb, //"aplicaciones_web" //Hay que meterla como argumento
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

    return pool;
  } catch (err) {
    console.error("Error base de datos getDb ", err);
  }
}

async function runQuery(query) {
  try {
    const ddbb = "aplicaciones_web";
    const conn = await getDb(ddbb);
    const [rows, fields] = await conn.query(query);
    await conn.end();
    return rows;
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    throw error;
  }
}


module.exports = { getDb, runQuery };
