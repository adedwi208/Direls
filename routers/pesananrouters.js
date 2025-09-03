const express = require("express");
const router = express.Router();
const pesananController = require("../controllers/pesananController");

// ✅ Route riwayat pesanan per user
router.get("/riwayat/:user_id", pesananController.getUserRiwayat);

module.exports = router;
