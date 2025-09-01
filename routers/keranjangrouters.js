const express = require("express");
const router = express.Router();
const keranjangController = require("../controllers/keranjangcontrollers");

router.get("/", keranjangController.getKeranjang);
router.post("/", keranjangController.addToKeranjang);
router.delete("/:id", keranjangController.deleteFromKeranjang);

module.exports = router;
