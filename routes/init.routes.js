const express = require("express");
const initController = require("../controllers/init.controller.react");

const router = express.Router();

router.get("/loginResources", async (req, res) => {
    try {
      const data = await initController.getLoginContent();
      res.json(data);
    } catch (error) {
      console.error("[init.routes] Error:", error.message);
      res.status(500).json({ error: "Error interno" });
    }
  });

module.exports = router;