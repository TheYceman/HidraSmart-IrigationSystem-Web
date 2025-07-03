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
          attributes: ['id_balsa', 'bbdd'],
        }
      ],
    });
 
    return userBalsas.map(ub => ({
      id_balsa: ub.balsa.id_balsa,
      bbdd: ub.balsa.bbdd
    }));
  } catch (error) {
    console.error('Error en getBalsas:', error);
    throw error;
  }
}


module.exports = { getBalsas };
