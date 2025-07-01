const Network = require('../models/network.model');
const { getPermits } = require("../data/get-permits");
const { Op } = require('sequelize');

async function getAllNetworks(req) {
    //OBTENER ROL DEL USUARIO
    let rolUser = req.session.user?.[0].permits.rol;
    //OBTENER LA RED
    let resultPermits = await getPermits(req.session.user[0].idusers, req.session.user[0].ddbbSelected);
    let idRed = resultPermits[0].id_network;
    console.log("RED: _______________________________________________________________________________________________")
    console.log(idRed);
    const networkCondition = rolUser == 'admin'
        ? { id: idRed}
        : { id: { [Op.ne]: null } };

    const networks = await Network.findAll({
        where: networkCondition,
        attributes: ['id', 'name_network']
    });

    return networks;
}


async function networksList(req, res) {
    try {
        const result = await getAllNetworks(req);
        res.json(result);
    } catch (error) {
        console.error('Error al obtener las networks:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    networksList
};
