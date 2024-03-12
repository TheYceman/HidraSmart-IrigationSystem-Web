const mysql = require("mysql");

function getDb() {
  try {
    let conn = mysql.createConnection({
      host: "hidralab-server.mysql.database.azure.com",
      user: "Iago",
      password: "hidra22Azure23",
      port: 3306,
      database: "aplicaciones_web",
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
        conn.destroy();
        reject(err);
      } else {
        conn.query(query, function (err, result, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
          conn.destroy();
        });
      }
    });
  });
}

module.exports = { runQuery };
