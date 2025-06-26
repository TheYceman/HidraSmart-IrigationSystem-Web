const { runQuery } = require("../data/bbdd-connector");

const Nodes = require("../models/nodes.model");
const ConsignmentPurge = require('../models/ConsignmentPurge.model');

async function getAllNodes(req, res) {
    const geNodes = [...(await Nodes.getAllNodes())];
    return geNodes;
}

const Conductions = require("../models/conductions.model");

async function getAllConductions(req, res) {
    const geConductions = [...(await Conductions.getAllConductions())];
    return geConductions;
}

async function getPercentageDate(req, res) {
    try{
        const { selectedDate } = req.body;
        const database = "resultados_alcazar";
        const queryString = `SELECT * FROM certidumbre WHERE hora = ?`;
        const result = await runQuery(queryString, [selectedDate], database);
        res.status(200).json(result);

    } catch (error) {
        console.error("Error al conectar a MySQL:", error);
        res.status(500).json({ error: 'Error al conectar a MySQL' });
    }
}

async function getDataDate(req, res) {
    try {
        const { selectedDate } = req.body;
        const database = "resultados_alcazar";

        const tables = ['depositosout', 'nodosout', 'conduccionesout', 'valvulasout', 'parcelasout'];
        let result = [];
        let totalQueryTime = 0;
        
        // Crear las promesas para cada consulta
        const promises = tables.map(async (tableName) => {
            const queryString = `SELECT * FROM ${tableName} WHERE hora = ?`;
            console.time(`Consulta a ${tableName}`);
            const queryResult = await runQuery(queryString, [selectedDate], database);
            console.timeEnd(`Consulta a ${tableName}`);
            
            // Capturar el tiempo de la consulta
            const queryTime = console.timeEnd(`Consulta a ${tableName}`);
            totalQueryTime += queryTime;
            
            result.push({
                table: tableName,
                data: queryResult,
            });
        });

        // Ejecutar todas las consultas en paralelo
        await Promise.all(promises);

        // Convertir el tiempo total a formato m:ss.mmm
        const totalSeconds = (totalQueryTime / 1000).toFixed(3);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = (totalSeconds % 60).toFixed(3);
        const formattedTotalTime = `${minutes}:${seconds.padStart(6, '0')}`;

        console.log(`Tiempo total de consultas: ${formattedTotalTime}`);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al conectar a MySQL:", error);
        res.status(500).json({ error: 'Error al conectar a MySQL' });
    }
}


async function getDatRangesDate(req, res) {
    try {
        const { selectedColumn, selectedDate } = req.body;

        const database = "resultados_alcazar";

        // Obtener lista de todas las tablas en la base de datos
        const tablesQuery = `SHOW TABLES FROM ${database}`;
        const tablesResult = await runQuery(tablesQuery);

        if (!tablesResult.success || !Array.isArray(tablesResult.data.rows)) {
            throw new Error('La respuesta de SHOW TABLES no es una lista.');
        }

        let globalMinValue = null;
        let globalMaxValue = null;

        // Iterar sobre cada tabla
        for (const tableRow of tablesResult.data.rows) {
            const tableName = tableRow[`Tables_in_${database}`];

            // Verificar si la tabla contiene las columnas 'hora' y 'selectedColumn'
            const columnsQuery = `SHOW COLUMNS FROM ${tableName}`;
            const columnsResult = await runQuery(columnsQuery, [], database);

            const hasHoraColumn = columnsResult.data.rows.some(column => column.Field === 'hora');
            const hasSelectedTableColumn = columnsResult.data.rows.some(column => column.Field === selectedColumn);

            if (hasHoraColumn && hasSelectedTableColumn) {
                // Si ambas columnas existen, obtener los valores mínimos y máximos de 'selectedColumn'
                const minMaxQuery = `SELECT MIN(${selectedColumn}) as Min_Value, MAX(${selectedColumn}) as Max_Value FROM ${tableName} WHERE hora = ?`;

                const result = await runQuery(minMaxQuery, [selectedDate], database);

                // Desestructurar los valores con los nombres correctos y renombrarlos
                const { Min_Value: minValue, Max_Value: maxValue } = result.data.rows[0];

                // Actualizar los valores globales mínimos y máximos
                if (minValue !== null && maxValue !== null) {
                    if (globalMinValue === null || minValue < globalMinValue) {
                        globalMinValue = minValue;
                    }
                    if (globalMaxValue === null || maxValue > globalMaxValue) {
                        globalMaxValue = maxValue;
                    }
                }
            }
        }

        const result = [{minValue: globalMinValue, maxValue: globalMaxValue} ];
        // Enviar los resultados
        res.status(200).json(result);
        
    } catch (error) {
        console.error("Error al conectar a MySQL:", error);
        res.status(500).json({ error: 'Error al conectar a MySQL' });
    }
}

async function getHistoricalData(req, res) {
    try {
        const { table, id } = req.body;
        const database = "resultados_alcazar";

        const queryString = `SELECT * FROM ${table} WHERE id = ?`;
        let result = await runQuery(queryString, [id], database);
                
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al conectar a MySQL:", error);
        res.status(500).json({ error: 'Error al conectar a MySQL' });
    }
}

async function getDataDateAnalysis(req, res) {
    try {
        const { selectedDate } = req.body;
        const database = "resultados_alcazar";

        const tables = ['depositosout', 'nodosout', 'conduccionesout', 'parcelasout'];
        let result = [];
        // let totalQueryTime = 0;
        
        // Crear las promesas para cada consulta
        const promises = tables.map(async (tableName) => {
            const queryString = `SELECT id,edad FROM ${tableName} WHERE hora = ?`;
            // console.time(`Consulta a ${tableName}`);
            const queryResult = await runQuery(queryString, [selectedDate], database);
            // console.timeEnd(`Consulta a ${tableName}`);
            
            // // Capturar el tiempo de la consulta
            // const queryTime = console.timeEnd(`Consulta a ${tableName}`);
            // totalQueryTime += queryTime;
            
            result.push({
                table: tableName,
                data: queryResult,
            });
        });

        // Ejecutar todas las consultas en paralelo
        await Promise.all(promises);

        // Convertir el tiempo total a formato m:ss.mmm
        // const totalSeconds = (totalQueryTime / 1000).toFixed(3);
        // const minutes = Math.floor(totalSeconds / 60);
        // const seconds = (totalSeconds % 60).toFixed(3);
        // const formattedTotalTime = `${minutes}:${seconds.padStart(6, '0')}`;

        // console.log(`Tiempo total de consultas: ${formattedTotalTime}`);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error al conectar a MySQL:", error);
        res.status(500).json({ error: 'Error al conectar a MySQL' });
    }
}

async function getShowAffectedPlots(req, res) {   
    try {
        const { edadLimite } = req.body;
        const database = "resultados_alcazar";
        const table = 'graficas_edad_coor';

        const queryString =  `SELECT id, \`${edadLimite}\` AS valor FROM ${table}`;
        let result = await runQuery(queryString, [], database);
                
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al conectar a MySQL:", error);
        res.status(500).json({ error: 'Error al conectar a MySQL' });
    }
}

const { exec } = require('child_process');

async function executeCalculateVolume (req, res) {
    const { conductionsSelected } = req.body;
    function ejecutarScript(conductionsSelected, ddbb, pemCertificate) {
        const parametros = {
            dbname: ddbb,
            user: process.env.AZURE_MYSQL_USER,
            password: process.env.AZURE_MYSQL_PASSWORD,
            host: process.env.AZURE_MYSQL_HOST,
            port: process.env.AZURE_MYSQL_PORT,
            tablaconsumos: 'dat_cont2',
            codigoconsumos: 'instante',
            tablac: 'conducciones',
            tablad: 'depositos',
            tablan: 'nodos',
            tablav: 'valvulas',
            tablae: 'nodos_equipos',
            pemFile: pemCertificate.replace(/\\n/g, '\n').replace(/"/g, '\\"').replace(/\\r/g, '\r').replace(/\\t/g, '\t')
        };
        const parametrosString = JSON.stringify(parametros);

        // Convertir conductionsSelected a JSON string
        const conductionsSelectedString = JSON.stringify(conductionsSelected);
        
        // Escapar el JSON para que se pase correctamente al script de Python
        const escapedParametrosString = parametrosString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        const scriptPath = process.env.SCRIPT_PATH + '/python/Volumen_purgas.py';
        const pythonPath = process.env.PYTHON_PATH;

        const command = `${pythonPath} ${scriptPath} ${conductionsSelectedString} "${escapedParametrosString}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el script de Python: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            try {
                const outputData = JSON.parse(stdout);
                return res.status(200).json(outputData);
            } catch (parseError) {
                console.error(`Error al analizar la salida del script de Python: ${parseError.message}`);
            }
        });
    }

    // Ejemplo de uso:
    const pemCertificate = process.env.PEM_CERTIFICATE_DDBB.replace(/\\n/g, '\n');
    ejecutarScript(conductionsSelected, 'contabast', pemCertificate);
};

async function insertIntoDatabaseConsignmentPurge(req, res) {
    const { data } = req.body;
    try {
        const result = await ConsignmentPurge.insert(data, 'resultados_alcazar');
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error insertando en la base de datos:', error);
        return res.status(500).json({ error: 'Error insertando en la base de datos' });
    }
};

async function executeEstimatePurge (req, res) {
    const { estimatePurgeDataArray } = req.body;
    function ejecutarScriptEstimatePurge(dataEstimatePurge, ddbbPropios, ddbbPN, pemCertificate) {
        const dataParameters ={
            id: dataEstimatePurge[0],
            verCoe: dataEstimatePurge[1],
            varCoe: dataEstimatePurge[2],
            verTieVol: dataEstimatePurge[3],
            varTieVol: dataEstimatePurge[4],
            timeData: dataEstimatePurge[5],
        };
        const dataParametersString = JSON.stringify(dataParameters);
        const escapedDataParametersString = dataParametersString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        const parametrosPropios = {
            dbname: ddbbPropios,
            user: process.env.AZURE_MYSQL_USER,
            password: process.env.AZURE_MYSQL_PASSWORD,
            host: process.env.AZURE_MYSQL_HOST,
            port: process.env.AZURE_MYSQL_PORT,
            tablaconsumos: 'dat_cont2',
            codigoconsumos: 'instante',
            tablac: 'conducciones',
            tablad: 'depositos',
            tablan: 'nodos',
            tablav: 'valvulas',
            tablae: 'nodos_equipos',
            pemFile: pemCertificate.replace(/\\n/g, '\n').replace(/"/g, '\\"').replace(/\\r/g, '\r').replace(/\\t/g, '\t')
        };
        const parametrosPropiosString = JSON.stringify(parametrosPropios);
        const escapedParametrosPropiosString = parametrosPropiosString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        const parametrosPN = {
            dbname: ddbbPN,
            user: process.env.AZURE_MYSQL_USER,
            password: process.env.AZURE_MYSQL_PASSWORD,
            host: process.env.AZURE_MYSQL_HOST,
            port: process.env.AZURE_MYSQL_PORT,
            tablac: 'conduccionesout',
            tablad: 'depositosout',
            tablan: 'nodosout',
            tablav: 'valvulasout',
            tablacal: 'calidad',
            tablacer: 'certidumbre',
            tablaval: 'valve_position',
            tablap: 'parcelasout',
            tablapur: 'purgas',
            tablagrafcoor: 'graficas_edad_coor',
            tablagrafpar: 'graficas_edad_parametros',
            pemFile: pemCertificate.replace(/\\n/g, '\n').replace(/"/g, '\\"').replace(/\\r/g, '\r').replace(/\\t/g, '\t')
        };
        const parametrosPNString = JSON.stringify(parametrosPN);
        const escapedParametrosPNString = parametrosPNString.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        console.log('dataParameters:');
        console.log(dataParametersString);
        
        // Escapar el JSON para que se pase correctamente al script de Python
        
       
        const scriptPath = process.env.SCRIPT_PATH + '/python/Estimador_purgas.py';
        const pythonPath = process.env.PYTHON_PATH;
        
        const command = `${pythonPath} ${scriptPath} "${escapedDataParametersString}" "${escapedParametrosPropiosString}" "${escapedParametrosPNString}"`;

        // console.log('Comando ejecutado:');
        // console.log(command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el script de Python: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            try {
                const outputData = JSON.parse(stdout);
                return res.status(200).json(outputData);
            } catch (parseError) {
                console.error(`Error al analizar la salida del script de Python: ${parseError.message}`);
            }
        });
    }

    // Ejemplo de uso:
    const pemCertificate = process.env.PEM_CERTIFICATE_DDBB.replace(/\\n/g, '\n');
    ejecutarScriptEstimatePurge(estimatePurgeDataArray, 'contabast', 'resultados_alcazar', pemCertificate);
};

const { nodeHistoricalDataPurge } = require('../models/node-historical-data-purge.model');

async function loadHistoricalDataPurge(req, res) {
    try {
        const result = await nodeHistoricalDataPurge('resultados_alcazar');
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error cargando los datos históricos:', error);
        return res.status(500).json({ error: 'Error cargando los datos históricos' });
    }
}

async function getPurgesData(req, res) {   
    try {
        const { selectedDate } = req.body;
        const database = "resultados_alcazar";

        const queryString =  `
            -- Consulta que extrae los registros con 'fecha_inicio' inferior a una hora antes de la fecha seleccionada y 'fecha_fin' mayor o igual a la fecha seleccionada.
            SELECT nodo AS Nodo, caudal AS 'Caudal_Equivalente'
            FROM resultados_alcazar.purgas 
            WHERE fecha_inicio < DATE_SUB(?, INTERVAL 1 HOUR)
            AND fecha_fin >= ?
            
            UNION ALL
            
            -- Consulta que extrae los registros cuando 'fecha_inicio' está dentro de la última hora antes de la fecha seleccionada y 'fecha_fin' es mayor o igual a la fecha seleccionada.
            SELECT nodo AS Nodo, (((60 - MINUTE(fecha_inicio)) * 60) * caudal) / 3600 AS 'Caudal_Equivalente'
            FROM resultados_alcazar.purgas
            WHERE fecha_inicio < ?
            AND fecha_inicio >= DATE_SUB(?, INTERVAL 1 HOUR)
            AND fecha_fin >= ?
            
            UNION ALL
            
            -- Consulta que extrae los registros con 'fecha_inicio' menor a una hora antes y 'fecha_fin' menor que la fecha seleccionada pero mayor o igual a una hora antes.
            SELECT nodo AS Nodo, ((MINUTE(fecha_fin) * 60) * caudal) / 3600 AS 'Caudal_Equivalente'
            FROM resultados_alcazar.purgas
            WHERE fecha_inicio < DATE_SUB(?, INTERVAL 1 HOUR)
            AND fecha_fin < ?
            AND fecha_fin >= DATE_SUB(?, INTERVAL 1 HOUR)
            
            UNION ALL
            
            -- Consulta que extrae los registros con 'fecha_inicio' mayor o igual a una hora antes de la fecha seleccionada y 'fecha_fin' menor o igual a la fecha seleccionada.
            SELECT nodo AS Nodo, (((MINUTE(fecha_fin) - MINUTE(fecha_inicio)) * 60) * caudal) / 3600 AS 'Caudal_Equivalente'
            FROM resultados_alcazar.purgas
            WHERE fecha_inicio > DATE_SUB(?, INTERVAL 1 HOUR)
            AND fecha_fin <= ?;
        `;
        let result = await runQuery(queryString, [
            selectedDate, selectedDate, 
            selectedDate, selectedDate, selectedDate,
            selectedDate, selectedDate, selectedDate,
            selectedDate, selectedDate
        ], database);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al conectar a MySQL:", error);
        res.status(500).json({ error: 'Error al conectar a MySQL' });
    }
}



module.exports = { 
    getAllNodes,
    getAllConductions,
    getPercentageDate,
    getDataDate,
    getDatRangesDate,
    getHistoricalData,
    getDataDateAnalysis,
    getShowAffectedPlots,
    executeCalculateVolume,
    insertIntoDatabaseConsignmentPurge,
    executeEstimatePurge,
    loadHistoricalDataPurge,
    getPurgesData,
};