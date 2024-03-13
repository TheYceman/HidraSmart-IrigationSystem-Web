const express = require("express");
const initController = require("../controllers/init.controller");

const router = express.Router();

/********** Selector de aplicaciones **********/

router.get("/", initController.getLogin);

/********** *********************** **********/

module.exports = router;