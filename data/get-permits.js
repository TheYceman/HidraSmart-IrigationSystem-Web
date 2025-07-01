const UserPermission = require('../models/user-permission.model');
const Network = require('../models/network.model');
const PermissionGroup = require('../models/permission-group.model');

async function getPermits(idUsers, nameNetwork = null) {
    try {
        let networkCondition = {};
        if (nameNetwork) {
            const network = await Network.findOne({
                attributes: ['id'],
                where: { name_network: nameNetwork },
                raw: true
            });
            
            if (!network) {
                console.error('No se encontró la red:', nameNetwork);
                return { success: false, permits: {} };
            }
            networkCondition.id_network = network.id;
        }

        const whereCondition = { id_users: idUsers, ...networkCondition };

        const userPermissions = await UserPermission.findAll({
            attributes: ['id_network', 'id_permission_group'],
            where: whereCondition,
            raw: true
        });

        if (!userPermissions || userPermissions.length === 0) {
            console.error('No se encontraron permisos para el usuario con la red:', nameNetwork);
            return { success: false, permits: {} };
        }

        const permissionGroupIds = userPermissions.map(up => up.id_permission_group);

        const groupPermissions = await PermissionGroup.findAll({
            attributes: ['id', 'per_cultivos', 'per_cupos', 'per_riegos', 'per_meteo', 'per_red', 'per_activos', 'per_cambios', 'per_usuarios',['nombre', 'rol']],
            where: { id: permissionGroupIds },
            raw: true
        });

        if (!groupPermissions || groupPermissions.length === 0) {
            console.error('No se encontraron permisos en permissions_group.');
            return { success: false, permits: {} };
        }
        groupPermissions[0].id_network = networkCondition.id_network;

        return groupPermissions;

    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        return { success: false, permits: {} };
    }
}


module.exports = { getPermits };