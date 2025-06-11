const express = require("express");
const applicationPanelController = require("../controllers/application-panel.controller.react");

const router = express.Router();

router.get("/applicationPanelResources", async (req, res) => {
    try {
      const data = await applicationPanelController.getApplicationPanelContent(req);
      res.json(data);
    } catch (error) {
      console.error("[application-panel.routes] Error:", error.message);
      res.status(500).json({ error: "Error interno" });
    }
  });

module.exports = router;