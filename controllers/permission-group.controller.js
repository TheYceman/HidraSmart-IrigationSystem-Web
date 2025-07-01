const { Op } = require('sequelize');
const PermissionGroup = require('../models/permission-group.model');
//const Permission = require('../models/permission.model');
const {getPermits} = require('../data/get-permits');
const PermissionLevels  = require('../models/permission-levels.model');

// Devuelve todos los grupos de permisos (solo ID y nombre)
async function getAllPermissionGroup(req) {
    const rolUser = req.session.user?.[0].permits.rol;
    console.log("ROL DEL USER: " + rolUser);

    const excludedPermissions = rolUser === 'Administrador'
        ? [4] // 1 = Admin, 4 = SuperAdmin
        : rolUser === 'SuperAdmin'
        ? [0]
        : (() => { throw new Error("Solo los administradores pueden gestionar usuarios"); })();

    try {
        const allPermissionGroup = await PermissionGroup.findAll({
            attributes: ["id", "nombre"],
            where: {
                id: { [Op.notIn]: excludedPermissions }
            }
        });

        return allPermissionGroup.map(group => ({
            id: group.id,
            nombre: group.nombre,
        }));
    } catch (error) {
        console.error('Error al obtener los grupos de permisos:', error.message);
        throw new Error('Error interno del servidor');
    }
}


async function permissionGroups(req, res) {
    try {
        const result = await getAllPermissionGroup(req);
        res.json(result);
    } catch (error) {
        console.error('Error al enviar los grupos de permisos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Devuelve los grupos de permisos para el front
async function getGroupPermissionsData(req) {

     let permisosUser = await getPermits(req.session.user[0].idusers,);
    console.log("_________________________________________________________________________________________")
    console.log(permisosUser);
    const grupos = await PermissionGroup.findAll({
        attributes: ['id', 'nombre'],
        include: [
            { model: PermissionLevels, as: 'equipos', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'activos', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'red', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'valvulas', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'simulador', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'estadisticas', attributes: ['id', 'level'] },
        ]
    });

    return grupos.map(group => ({
        idGrupo: group.id,
        nombreGrupo: group.nombre,
        per_equipos: {
            id: group.equipos.id,
            level: group.equipos.level
        },
        per_activos: {
            id: group.activos.id,
            level: group.activos.level
        },
        per_red: {
            id: group.red.id,
            level: group.red.level
        },
        per_valvulas: {
            id: group.valvulas.id,
            level: group.valvulas.level
        },
        per_simulador: {
            id: group.simulador.id,
            level: group.simulador.level
        },
        per_estadistica: {
            id: group.estadistica.id,
            level: group.estadistica.level
        }
    }));
}

async function getGroupPermission(req, res) {
    try {
        const result = await getGroupPermissionsData(req);
        res.json(result);
    } catch (error) {
        console.error('Error al obtener los grupos de permisos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
async function updateGroupPermissions(req, res) {
    const {
        idGrupo,
        per_equipos,
        per_activos,
        per_red,
        per_valvulas,
        per_simulador,
        per_estadistica
    } = req.body;

    try {
        const group = await PermissionGroup.findByPk(idGrupo);
        if (!group) return res.status(404).json({ error: 'Grupo no encontrado' });

        await group.update({
            per_equipos,
            per_activos,
            per_red,
            per_valvulas,
            per_simulador,
            per_estadistica
        });

        res.json({ message: 'Grupo actualizado' });
    } catch (error) {
        console.error("Error al actualizar grupo:", error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
async function createPermissionGroup(req, res) {
    const {
        nombreGrupo,
        per_equipos,
        per_activos,
        per_red,
        per_valvulas,
        per_simulador,
        per_estadistica
    } = req.body;

    if (!nombreGrupo || !per_equipos || !per_activos || !per_red || !per_valvulas || !per_simulador || !per_estadistica) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const nuevoGrupo = await PermissionGroup.create({
            nombre: nombreGrupo,
            per_equipos,
            per_activos,
            per_red,
            per_valvulas,
            per_simulador,
            per_estadistica
        });

        res.status(201).json({
            message: 'Grupo creado exitosamente',
            grupo: {
                id: nuevoGrupo.id,
                nombre: nuevoGrupo.nombre
            }
        });
    } catch (error) {
        console.error("Error al crear grupo:", error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function deletePermissionGroup(req, res) {
    const { id } = req.params;

    try {
        const group = await PermissionGroup.findByPk(id);

        if (!group) {
            return res.status(404).json({ error: 'Grupo no encontrado' });
        }

        await group.destroy();
        res.json({ message: 'Grupo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar grupo:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



module.exports = { permissionGroups, getGroupPermission, updateGroupPermissions, createPermissionGroup, deletePermissionGroup};
