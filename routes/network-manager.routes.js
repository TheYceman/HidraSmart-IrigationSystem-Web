const express = require('express');
const router = express.Router();
const networkStatusController = require('../controllers/network-manager.controller');
const NodosInv = require('../models/nodos_inv.model');

function getDatabaseFromSelection(ddbbSelected) {
    switch (ddbbSelected) {
        case 'alcazar':
            return 'contabast';
        case 'corral':
            return 'contabast_corral';
        default:
            throw new Error(`Base de datos desconocida: ${ddbbSelected}`);
    }
}

router.post('/getPercentageDate', networkStatusController.getPercentageDate);

router.post('/getDataDate', networkStatusController.getDataDate);

router.post('/getDatRangesDate', networkStatusController.getDatRangesDate);

router.post('/getHistoricalData', networkStatusController.getHistoricalData);

router.post('/getDataDateAnalysis', networkStatusController.getDataDateAnalysis);

router.post('/getShowAffectedPlots', networkStatusController.getShowAffectedPlots);

router.post('/executeCalculateVolume', networkStatusController.executeCalculateVolume);

router.post('/insertIntoDatabaseConsignmentPurge', networkStatusController.insertIntoDatabaseConsignmentPurge);

router.post('/executeEstimatePurge', networkStatusController.executeEstimatePurge);

router.post('/loadHistoricalDataPurge', networkStatusController.loadHistoricalDataPurge);

router.post('/getPurgesData', networkStatusController.getPurgesData);


module.exports = router;