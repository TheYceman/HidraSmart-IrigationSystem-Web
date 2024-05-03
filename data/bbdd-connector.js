const mysql = require('mysql2/promise');
const fetch = require('node-fetch');

async function downloadBlob() {
  // console.log('process.env.BLOB_SAS_URL:', process.env.BLOB_SAS_URL);
  const blobSasUrl = process.env.BLOB_SAS_URL

  const response = await fetch("https://girfodt.blob.core.windows.net/certificates-hshi/DigiCertGlobalRootCA.crt.pem?sp=r&st=2024-04-23T19:53:39Z&se=2050-04-24T03:53:39Z&spr=https&sv=2022-11-02&sr=c&sig=jQRfzZsZCu1zQ5Isg50pHQSbsmEK2%2B0amxTF%2B2YLgg8%3D");
  const certContent = await response.text();
  // console.log('Descargado el archivo .pem con éxito:\n', certContent);
  return certContent;
}

downloadBlob().catch((err) => {
  console.error('Error al descargar el archivo .pem:', err.message);
});

async function getDb(ddbb) {
  try {
    const certContent = await downloadBlob();

    console.log("bbb" + process.cwd());

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
        ca: certContent,
      },
    });

    return pool;
  } catch (err) {
    console.error("Error base de datos getDb ", err);
  }
}

async function runQuery(queryString, values, database) {
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
