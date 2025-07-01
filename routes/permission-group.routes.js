const express = require('express');
const router = express.Router();
const { permissionGroups, getGroupPermission, updateGroupPermissions, createPermissionGroup, deletePermissionGroup} = require('../controllers/permission-group.controller');

router.get('/permission-group/', permissionGroups);
router.get('/all-permission-group/', getGroupPermission);
router.put('/update-permission-group/:id', updateGroupPermissions);
router.post('/create-permission-group', createPermissionGroup);
router.delete('/delete-permission-group/:id', deletePermissionGroup);

module.exports = router;