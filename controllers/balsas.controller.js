const Balsa = require('../models/balsa.model');
const UserBalsa = require('../models/user-balsa.model');
const Network = require('../models/network.model');

async function getBalsasConEstadoPorUsuario(req, res) {
  const userId = req.params.userId;
  const idRed = req.session.user?.[0].permits.id_network;
  const rolUser = req.session.user?.[0].permits.rol;

  try {
    // 1. Filtro según el rol
    const filtroBalsas = {};
    if (rolUser === 'Administrador') {
      filtroBalsas.network_id = idRed;
    }

    // 2. Obtener balsas con red asociada
    const todasLasBalsas = await Balsa.findAll({
      where: filtroBalsas,
      attributes: ['id_balsa', 'num_balsa', 'network_id'],
      include: [{
        model: Network,
        as: 'network',
        attributes: ['name_network'],
      }],
      raw: true,
      nest: true,
    });

    // 3. Obtener balsas asignadas al usuario
    const balsasAsignadas = await UserBalsa.findAll({
      where: { user_id: userId },
      attributes: ['balsa_id'],
      raw: true,
    });

    const idsAsignados = new Set(balsasAsignadas.map(b => b.balsa_id));

    // 4. Formar respuesta final plana
    const resultado = todasLasBalsas.map(balsa => ({
      id_balsa: balsa.id_balsa,
      num_balsa: balsa.num_balsa,
      network_id: balsa.network_id,
      name_network: balsa.network.name_network, // ahora está plano
      estado: idsAsignados.has(balsa.id_balsa) ? 'permitido' : 'denegado',
    }));

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener balsas con estado:", error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = { getBalsasConEstadoPorUsuario };
