const mysql = require("mysql2");
const fs = require('fs');

function getDb() {
  const certPath = './config/certificados/DigiCertGlobalRootCA.crt.pem';
  console.log("bbb" + process.cwd())
  try {
    let conn = mysql.createConnection({
      host: "hidralab-server.mysql.database.azure.com",
      user: "telemedida_alcazar",
      password: "Hidra2023Alcazar",
      port: 3306,
      database: "aplicaciones_web",
      ssl : {
        ca : fs.readFileSync(certPath),
    }
    });
    return conn;
  } catch (err) {
    console.log(err);
  }
}

function runQuery(query) {
  return new Promise((resolve, reject) => {
    const conn = getDb();
    conn.connect(function (err) {
      if (err) {
        conn.end();
        reject(err);
      } else {
        conn.query(query, function (err, result, fields) {
          conn.end();
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
}

module.exports = { getDb, runQuery };
