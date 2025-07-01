const UserBalsa = require('../models/user-balsa.model');
const Balsa = require('../models/balsa.model');

async function getBalsas(idUsers, idnetwork) {
  try {
    const userBalsas = await UserBalsa.findAll({
      where: { user_id: idUsers },
      include: [
        {
          model: Balsa,
          as: 'balsa',
          where: { network_id: idnetwork },
          attributes: ['id_balsa'],
        }
      ],
    });

    return userBalsas.map(ub => ub.balsa.id_balsa);
  } catch (error) {
    console.error('Error en getBalsas:', error);
    throw error;
  }
}

module.exports = { getBalsas };