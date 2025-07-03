const express = require('express');
const router = express.Router();
const layerManagerController = require('../controllers/layer-manager.controller');

/* sección [Conseguir válvulas] definir válvulas */
router.post("/getAllValves/:bbdd", async (req, res) => {
  try {
    const valves = await layerManagerController.getAllValve(req.params.bbdd);
    res.json(valves);
  } catch (error) {
    console.error('Error in getAllValves route:', error);
    res.status(500).json({ error: error.message });
  }
});/* [Fin de sección] */
module.exports = router;