const { runQuery } = require("../data/bbdd-connector");

class Contador {
  constructor(contador) {
    this.id = contador.ideEle;
    this.sector = contador.ideSector;
    this.tramo = contador.ideTramo
    this.ramal = contador.ideRamal;
    this.titular = contador.ideTitular;
    this.radio = contador.ideRadio;
    this.marca = contador.marca;
    this.dimension = contador.dimension;
    this.Qnominal = contador.Qnominal;
    this.volAsignado = contador.volAsignado;
    this.coorX = contador.coorX;
    this.coorY = contador.coorY;
    this.coorZ = contador.coorZ;
    this.displayId = `Sec${this.sector}_val_${this.id}`;
    this.tipoElemento = 2;
    //Añadimos 
    this.calle_num=contador.calle_num;
    this.acumulado = contador.acumulado;
    this.instante = contador.instante;
    this.bateria = contador.bateria;
    this.RSSI = contador.RSSI;

  }

  /*static async getPerPage(startIndex, endIndex) {
   const data = await runQuery("SELECT * FROM ge_contadores LIMIT " + startIndex + ", " + endIndex + ";");
   const geContadores = data.map((contador) => new Contador(contador));
   return geContadores;
 }*/


  static async getPerPage(perPage, offset) {
    const data = await runQuery("SELECT * FROM ge_contadores LIMIT " + perPage + " OFFSET " + offset + ";");
    const geContadores = data.map((contador) => new Contador(contador));
    return geContadores;
  }

  static async getCountAll() {
    const data = await runQuery("SELECT count(*) as total FROM ge_contadores;");
    const geTotal = data.map((total) => total);
    console.log(geTotal[0].total);
    return geTotal[0].total;
  }

  static async getAll() {
    const data = await runQuery("SELECT * FROM ge_contadores;");
    const geContadores = data.map((contador) => new Contador(contador));
    //console.log(geContadores);
    //var result = [];
    //for(let contador of geContadores) {
    //  result.push({id: contador.id.replace(/&quot;/g, '"'), sector: contador.sector.replace(/&quot;/g, '"'), tramo: contador.tramo.replace(/&quot;/g, '"')});
    //} 
    //return JSON.stringify(result);
    return geContadores;
  }

  static async getTelemedida() {
    const data = await runQuery("SELECT ge_contadores.*, dat_contadores.acumulado, dat_contadores.instante, dat_contadores.bateria, dat_contadores.RSSI FROM dat_contadores, ge_contadores WHERE dat_contadores.ideEle=ge_contadores.ideEle ORDER BY instante DESC;");
    const geContadores = data.map((contador) => new Contador(contador));
    //console.log(geContadores);
    //var result = [];
    //for(let contador of geContadores) {
    //  result.push({id: contador.id.replace(/&quot;/g, '"'), sector: contador.sector.replace(/&quot;/g, '"'), tramo: contador.tramo.replace(/&quot;/g, '"')});
    //} 
    //return JSON.stringify(result);
    return geContadores;
  }

  static async getSinTelemedida() {
    const data = await runQuery("SELECT ge_contadores.*, dat_contadores.acumulado, dat_contadores.instante FROM dat_contadores, ge_contadores WHERE dat_contadores.ideEle=ge_contadores.ideEle ORDER BY instante DESC LIMIT 1;");
    const geContadores = data.map((contador) => new Contador(contador));
    //console.log(geContadores);
    //var result = [];
    //for(let contador of geContadores) {
    //  result.push({id: contador.id.replace(/&quot;/g, '"'), sector: contador.sector.replace(/&quot;/g, '"'), tramo: contador.tramo.replace(/&quot;/g, '"')});
    //} 
    //return JSON.stringify(result);
    return geContadores;
  }

  static async getFilteredData(sector) {
    const data = await runQuery(
      `SELECT * FROM ge_contadores WHERE ideSector=${sector}";`
    );
    return data;
  }
}

//CONSTRUCCIÓN DE CONSULTAS PARA CONTADORES, 
/*
Contadores con telemedida 

Contador: IdeEle 

Ubicación: calle num (ge_contadores) 

Vol. Acum. (l):_acumulado (dat_contadores) 

Caudal (l/h): acumulado - acumulado (anterior)/Diferencia tiempo (h) (dat_contadores) 

Batería (%): ((batería(dat_contador)-3300)/ 450)*100 (dat_contadores) 

Señal: (Buena (RSSI>-80) | Media(95<RSSI<-80) | Mala(RSSI<-95) (dat_contadores) 

Fecha: dd-mm-aaaa hh:mm (instante último registro) (dat_contadores) 

Alarmas:  

Fallo comunicación (Si instante actual mayor a 60 minutos que la fecha) 

Batería baja (Si batería < 50%) 

Si está contando se pondrá icono de contando. 

 

Contadores sin telemedida: 

Contador: IdeEle 

Ubicación: calle num (ge_contadores) 

Vol. Acum. (m3):_volAcum (dat_contadores) 

Fecha: dd-mm-aaaa hh:mm (instante último registro) 

 

Presiones con telemedida 

Sensor: IdeSensor 

Presión (bar): presion (dat_presion) 

Batería (%): ((batería(dat_ presion)-1400)/ 2000)*100 

Señal: (Buena (RSSI>-80) | Media(95<RSSI<-80) | Mala(RSSI<-95) 

Fecha: dd-mm-aaaa hh:mm (instante último registro) 

Alarmas:  

Fallo comunicación (Si instante actual mayor a 30 minutos que la fecha) 

Batería baja (Si batería < 50%) 

 

Caudalímetros con telemedida 

Sensor: IdeSensor 

Vol. Acum. (m3): contAcum (dat_caudalimetro) 

Caudal. (m3/h): mediaQ1-Q15 (dat_caudalimetro) 

Presión (bar): presion (dat_presion) (Si disponible) 

Batería (%): ((batería(dat_ caudalimetro)-1400)/ 2000)*100 

Señal: (Buena (RSSI>-80) | Media(95<RSSI<-80) | Mala(RSSI<-95) 

Fecha: dd-mm-aaaa hh:mm (instante último registro) 

Alarmas:  

Fallo comunicación (Si instante actual mayor a 30 minutos que la fecha) 

Batería baja (Si batería < 50%) 

*/
module.exports = Contador;
