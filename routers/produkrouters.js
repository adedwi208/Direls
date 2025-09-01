const express = require("express");
const router = express.Router();
const produkController = require("../controllers/produkcontrollers");

router.get("/", produkController.getAllProduk);
router.get("/:id", produkController.getProdukById);
router.get("/:id/kemasan", produkController.getKemasanByProduk);

module.exports = router;
