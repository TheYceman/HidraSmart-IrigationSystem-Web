const { Op } = require('sequelize');
const User = require('../models/user.model');
const PermissionGroup = require('../models/user-permission.model');
const UserPermission = require('../models/user-permission.model');
const { hashatePassword } = require("../config/hashate-password");

const getFilteredUsers = async (req) => {
  const rolUser = req.session.user?.[0].permits.rol;
  if (!rolUser || (rolUser !== 'Administrador' && rolUser !== 'SuperAdmin')) {
    const error = new Error('Debes ser administrador para acceder aquí');
    error.statusCode = 403;
    throw error;
  }
  
  const excludedPermissions = rolUser === 'Administrador' ? [1, 4] : [4];

  const users = await User.findAll({
    attributes: ['idusers', 'username', 'name', 'surname', 'email'],
    include: [{
      model: UserPermission,
      attributes: [],
      required: false,
      where: {
        id_permission_group: { [Op.notIn]: excludedPermissions }
      }
    }]
  });

  return users.map(user => ({
    idusers: user.idusers,
    username: user.username,
    name: user.name,
    surname: user.surname, 
    email: user.email
  }));
};

async function getAllUsers(req, res) {
  try {
    const result = await getFilteredUsers(req);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

// Creaccion del usuario
async function createUser(req, res) {
    const { username, name, surname, email, password } = req.body;
        console.log("REQ.BODY:", req.body);
        console.log("::::::::::::::::::::::::::::  EJECUTANDO CREAR USER  ::::::::::::::::::::::::::::::::::::::::::::::::::::");
    try {
        
        if (!username || !name || !surname || !email || !password) {
            return res.status(433).json({ message: 'Faltan campos obligatorios' });
        }

        const PhashedPassword = hashatePassword(password);
        console.log("***************************** CONTRASEÑA CIFRADA *********************************");
        console.log(PhashedPassword);
        const newUser = await User.create({
            username,
            name,
            surname,
            email,
            password: PhashedPassword 
        });

         await UserPermission.create({
            id_users: newUser.idusers,  
            id_network: 1,
            id_permission_group: 9
        });
        

        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error al crear usuario:', err.message);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
}
async function getUsersPermission(iduser) {
  try {
    const permisos = await UserPermission.findAll({
      where: { id_users: iduser },
      attributes: ['id_network', 'id_permission_group']
    });
    console.log("*************************PERMISOS USER*********************");
    console.log(permisos);
    return permisos.map(p => ({
      id_network: p.id_network,
      id_permission_group: p.id_permission_group
    }));
  } catch (error) {
    console.error("Error al obtener permisos del usuario:", error.message);
    throw new Error("Error interno al obtener permisos del usuario");
  }
}
//ACTUALIZAR PERMISOS DEL USUARIO
async function updateUserPermissions(req, res) {
  const updates = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'El cuerpo debe ser un array de objetos con id_users, id_network e id_permissions' });
  }

  try {
    for (const update of updates) {
      const { id_users, id_network, id_permission_group } = update;

      if (!id_users || !id_network || !id_permission_group) {
        return res.status(400).json({ error: 'Faltan datos obligatorios en uno de los elementos' });
      }

      const existingPermission = await UserPermission.findOne({
        where: { id_users, id_network }
      });

      if (existingPermission) {
        existingPermission.id_permission_group = id_permission_group;
        await existingPermission.save();
      } else {
        await UserPermission.create({ id_users, id_network, id_permission_group });
      }
    }

    res.status(200).json({ message: 'Permisos actualizados correctamente' });

  } catch (error) {
    console.error('Error al actualizar permisos del usuario:', error.message);
    res.status(500).json({ error: 'Error interno al actualizar permisos' });
  }
}
//ELIMINAR USUARIO:
async function deleteUser(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID del usuario' });
  }

  try {
    // Primero borrar permisos asociados al usuario
    await UserPermission.destroy({
      where: { id_users: id }
    });

    // Luego borrar el usuario
    const deletedCount = await User.destroy({
      where: { idusers: id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario y permisos eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message);
    res.status(500).json({ error: 'Error interno al eliminar usuario' });
  }
}
//Actualizar informacion del usuario
async function updateUserInfo(req, res) {
  const { id } = req.params;
  const { username, name, surname, email } = req.body;

  if (!username || !name || !surname || !email) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    const [updatedRows] = await User.update(
      { username, name, surname, email },
      { where: { idusers: id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o sin cambios' });
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
}
module.exports = { getAllUsers, createUser, getUsersPermission, updateUserPermissions, deleteUser, updateUserInfo };
