const express = require('express');
const router = express.Router();
const layerManagerController = require('../controllers/layer-manager.controller');

router.post("/getAllValves/:bbdd", layerManagerController.getAllValve);

module.exports = router;