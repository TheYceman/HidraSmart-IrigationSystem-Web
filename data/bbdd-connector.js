const mysql = require('mysql2/promise');

async function getDb(ddbb) {
  try {

    const pemFile = process.env.PEM_CERTIFICATE_DDBB.replace(/\\n/g, '\n');
  
    console.log("bbb " + process.cwd());

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
        ca: pemFile,
      },
    });

    return pool;
  } catch (err) {
    console.error("Error base de datos getDb ", err);
  }
}

async function runQuery(queryString, values, database) {

  //console.log("QUERYSTRING " + queryString);
  try {
      const connection = await getDb(database);
      const [rows, fields] = await connection.execute(queryString, values);
      await connection.end();
      
      return {
          success: true,
          data: {
              rows,
              fields
          }
      };
  } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      throw error;
  }
}


module.exports = { runQuery };
