const Usuario = require("../models/usuario.model");

const { runQuery } = require("../data/bbdd-connector");

const emailSender = require('../utils/emailSender');

const crypto = require('crypto');
const { encrypt } = require("../helpers/handleBcrypt");

async function getGeDataUsuario(req, res) {
  const geData = [...(await Usuario.getAll(req, res))];
  return geData;
}


async function getTotalPagesUsuarios(req, res) {

  pages = 1;
  const itemsPerPage = 10;
  const number_registers = await Usuario.getCountAll(req, res);

  //console.log("number_registers " + number_registers);

  if (number_registers > 0) {
    pages = number_registers / itemsPerPage;
  }

  return pages;
}

async function getGeDataUsuariosPerPage(req, res) {

  const page = parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 10; // Cantidad de elementos por página
  const offset = (page - 1) * itemsPerPage;
  const geData = [...(await Usuario.getPerPage(req, res, itemsPerPage, offset))];

  /*const page =  parseInt(req.query.page) || 1; // Página actual
  const itemsPerPage = 20; // Registros por página

  // Calcular el índice inicial y final de los registros
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const geData = [...(await Contador.getPerPage(startIndex, endIndex))];*/

  return geData;
}

async function getDataUsuario(req, res) {
  const params = req.query;
  let result = await Usuario.getFilteredData(
    req, res, params.ideSector
  );
  res.json(result);
  // pasar a json el resultado de la linea anterior y añadir a la response
}

async function updateUsuario(req, res) {
  //console.log("UpdateUsuario " + req.body);

  // Obtener los parámetros del cuerpo de la solicitud
  const username = req.body.username.trim();
  const nombre = req.body.name.trim();
  const apellido = req.body.surname.trim();
  const grupo = req.body.grupo.trim();
  const email = req.body.email.trim();
  const phone = req.body.phone.trim();
  //const password = req.body.password.trim();

  //console.log("updateUsuario " + username + " " + grupo);

  const queryString = `UPDATE users SET name = ?, surname = ?, rol = ?, email = ?, phone = ? WHERE username = ?;`;
  const values = [nombre, apellido, grupo, email, phone, username];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Usuario actualizado con éxito");
  }
  return result.data.rows;;

}

async function deleteUsuario(req, res) {

  // Obtener los parámetros del cuerpo de la solicitud
  const username = req.body.username.trim();

  //console.log("deleteUsuario " + username);

  const queryString = "DELETE FROM users WHERE username = ?;";
  const values = [username];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Usuario borrado con éxito");
  }
  res.redirect('/gestor-usuarios');
  //return data;

}

// Ruta para procesar el formulario de añadir
async function agregaUsuario(req, res) {

  if (!req.body)
    return res.sendStatus(400)
  //console.log(req.body);

  const login = req.body.username.trim();
  const nombre = req.body.name.trim();
  const apellido = req.body.surname.trim();
  const grupo = req.body.grupo.trim();
  const email = req.body.email.trim();
  const phone = req.body.phone.trim();

  let propietario=0;
  if (req.session.user[0].idusers) {
    propietario=req.session.user[0].idusers;
  }

  // Generar y mostrar la clave
  const claveGenerada = generarClave();
  //console.log(claveGenerada);

  const password = await encrypt(claveGenerada);
  //const nuevoRegistro = { login, password, nombre, apellido, grupo, email, phone };

  const queryString = "INSERT INTO users (username, password, name, surname, rol, email, phone, owner) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
  const values = [login, password, nombre, apellido, grupo, email, phone, propietario];
  const database = 'aplicaciones_web';
  const result = await runQuery(queryString, values, database);
  if (result.success) {
    console.log("Usuario insertado con éxito");

    const emailSent = await emailSender.sendEmailNewUser(nombre, email, claveGenerada);
    if (emailSent) {
      console.log('Correo electrónico enviado con éxito');
    } else {
      console.log('Error al enviar el correo electrónico');
      alert('Error al enviar el correo electrónico'); // Muestra un mensaje emergente al usuario
    }
    res.redirect('/gestor-usuarios');
  } else {
    console.log('Error al insertar el usuario en la base de datos');
    alert('Error al insertar el usuario en la base de datos'); // Muestra un mensaje emergente al usuario
  }
  
}


function generarClave() {
  // Longitud de la clave
  const longitud = 8;

  // Caracteres válidos para la clave (letras y números)
  const caracteresValidos = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let clave = '';

  for (let i = 0; i < longitud; i++) {
    // Generar un índice aleatorio dentro del rango de caracteres válidos
    const indice = crypto.randomInt(0, caracteresValidos.length);

    // Agregar el carácter correspondiente al índice aleatorio a la clave
    clave += caracteresValidos.charAt(indice);
  }

  return clave;
}


module.exports = { getGeDataUsuario, getDataUsuario, getGeDataUsuariosPerPage, updateUsuario, deleteUsuario, agregaUsuario, getTotalPagesUsuarios };
