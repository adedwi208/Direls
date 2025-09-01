const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admincontrollers");
const multer = require("multer");

// Konfigurasi upload foto produk
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Endpoints
router.post("/produk", upload.single("foto"), adminController.tambahProduk);
router.get("/riwayat", adminController.getRiwayat);
router.get("/pesanan-masuk", adminController.getPesananMasuk);
router.put("/pesanan/:id/proses", adminController.prosesPesanan);
router.get("/pelanggan", adminController.getPelanggan);

module.exports = router;
