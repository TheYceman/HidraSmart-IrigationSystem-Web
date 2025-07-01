const {networksList} = require('../controllers/network.controller');
const express = require('express');
const router = express.Router();

router.get('/networks', networksList); 
module.exports= router;