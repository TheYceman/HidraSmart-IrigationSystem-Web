const mysql = require("mysql2/promise");
const fs = require('fs');

const certPath = './config/certificados/DigiCertGlobalRootCA.crt.pem';

function getDb(ddbb) {

  console.log("bbb" + process.cwd());
  
  try {
    let conn = mysql.createConnection({
      host: "hidralab-server.mysql.database.azure.com",
      user: "telemedida_alcazar",
      password: "Hidra2023Alcazar",
      port: 3306,
      database: ddbb, //"aplicaciones_web"
      ssl: {
        ca: fs.readFileSync(certPath),
      }
    });
    return conn;
  } catch (err) {
    console.log(err);
  }
}

async function runQuery(query) {
  try {
    const ddbb ="aplicaciones_web";
    const conn = await getDb(ddbb);
    const [rows, fields] = await conn.execute(query);
    await conn.end();
    return rows;
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    throw error;
  }
}


module.exports = { getDb, runQuery };
