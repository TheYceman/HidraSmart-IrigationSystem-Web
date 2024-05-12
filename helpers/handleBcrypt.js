const bcrypt = require('bcryptjs');

//Función para encriptar la clave
const encrypt = async (textPplain) => {
    const hash = await bcrypt.hash(textPplain, 10);
    return hash;
}

//Función para comparar si es la misma
const compare = async (passwordPlain, hashPassword) => {
    return await bcrypt.compare(passwordPlain, hashPassword);
}

module.exports = { encrypt, compare }