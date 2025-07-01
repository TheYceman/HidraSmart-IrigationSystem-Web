const express = require('express');
const router = express.Router();
const { getAllPermissionLevels } = require('../controllers/permission-level.controller');

router.get('/permission-levels/', getAllPermissionLevels);



module.exports = router;