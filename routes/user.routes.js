const { getAllUsers, createUser, getUsersPermission, updateUserPermissions, deleteUser,updateUserInfo } = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.get('/getAllUsers/', getAllUsers); 
router.post('/create-user', (req, res, next) => {
    next();
}, createUser);
router.get('/user-permissions/:iduser', async (req, res) => {
  try {
    const { iduser } = req.params;
    const result = await getUsersPermission(iduser);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener permisos del usuario' });
  }
});
router.post('/update-user-permissions/', updateUserPermissions);
router.delete('/delete-user/:id', deleteUser);
router.put('/update-user/:id', updateUserInfo);
module.exports = router;