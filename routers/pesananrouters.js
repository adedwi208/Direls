// routes/pesananRoutes.js
const express = require("express");
const router = express.Router();
const pesananController = require("../controllers/pesanancontrollers");

router.get("/riwayat/:user_id", pesananController.getUserRiwayat);

module.exports = router;
