const { Op } = require('sequelize');
const PermissionGroup = require('../models/permission-group.model');
const PermissionLevels = require('../models/permission-levels.model');
const { getPermits } = require('../data/get-permits');

// Devuelve todos los grupos de permisos (solo ID y nombre)
async function getAllPermissionGroup(req) {
    const rolUser = req.session.user?.[0].permits.rol;
    console.log("ROL DEL USER: " + rolUser);

    const excludedPermissions = rolUser === 'Administrador'
        ? [4]
        : rolUser === 'SuperAdmin'
            ? [0]
            : (() => { throw new Error("Solo los administradores pueden gestionar usuarios"); })();

    try {
        const allPermissionGroup = await PermissionGroup.findAll({
            attributes: ['id', 'nombre'],
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

// Devuelve los grupos de permisos con niveles relacionados
async function getGroupPermissionsData(req) {
    const permisosUser = await getPermits(req.session.user[0].idusers);
    console.log("Permisos del usuario:", permisosUser);

    const grupos = await PermissionGroup.findAll({
        attributes: ['id', 'nombre'],
        include: [
            { model: PermissionLevels, as: 'cultivos', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'cupos', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'riegos', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'meteo', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'red', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'activos', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'cambios', attributes: ['id', 'level'] },
            { model: PermissionLevels, as: 'usuarios', attributes: ['id', 'level'] },
        ]
    });

    return grupos.map(group => ({
        idGrupo: group.id,
        nombreGrupo: group.nombre,
        per_cultivos: group.cultivos,
        per_cupos: group.cupos,
        per_riegos: group.riegos,
        per_meteo: group.meteo,
        per_red: group.red,
        per_activos: group.activos,
        per_cambios: group.cambios,
        per_usuarios: group.usuarios,
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

// Actualiza un grupo de permisos
async function updateGroupPermissions(req, res) {
    const {
        idGrupo,
        per_cultivos,
        per_cupos,
        per_riegos,
        per_meteo,
        per_red,
        per_activos,
        per_cambios,
        per_usuarios
    } = req.body;

    try {
        const group = await PermissionGroup.findByPk(idGrupo);
        if (!group) return res.status(404).json({ error: 'Grupo no encontrado' });

        await group.update({
            per_cultivos,
            per_cupos,
            per_riegos,
            per_meteo,
            per_red,
            per_activos,
            per_cambios,
            per_usuarios
        });

        res.json({ message: 'Grupo actualizado' });
    } catch (error) {
        console.error("Error al actualizar grupo:", error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

// Crea un nuevo grupo de permisos
async function createPermissionGroup(req, res) {
    const {
        nombreGrupo,
        per_cultivos,
        per_cupos,
        per_riegos,
        per_meteo,
        per_red,
        per_activos,
        per_cambios,
        per_usuarios
    } = req.body;

    if (!nombreGrupo || !per_cultivos || !per_cupos || !per_riegos || !per_meteo || !per_red || !per_activos || !per_cambios || !per_usuarios) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const nuevoGrupo = await PermissionGroup.create({
            nombre: nombreGrupo,
            per_cultivos,
            per_cupos,
            per_riegos,
            per_meteo,
            per_red,
            per_activos,
            per_cambios,
            per_usuarios
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

// Elimina un grupo
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

module.exports = {
    permissionGroups,
    getGroupPermission,
    updateGroupPermissions,
    createPermissionGroup,
    deletePermissionGroup
};
