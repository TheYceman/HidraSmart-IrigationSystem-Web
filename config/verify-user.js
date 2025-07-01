const User = require('../models/user.model');
const { hashatePassword } = require("../config/hashate-password");

async function verifyUser(username, password) {
 

    try {
        const hashedPassword = hashatePassword(password);
        const users = await User.findAll({
            attributes: [
                'idusers',
                'username',
                'name',
                'surname',
                'email',
                'two_factor_enabled'
            ],
            where: {
                username: username,
                password: hashedPassword,
            },
            raw: true,
        });

        return users[0] || null; // Devuelve el primer usuario encontrado o null si no hay coincidencias
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return [];
    }
}
module.exports = { verifyUser };