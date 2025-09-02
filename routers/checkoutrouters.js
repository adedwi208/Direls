const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST checkout -> langsung ke tabel pesanan
router.post("/", async (req, res) => {
  const {
    user_id,
    nama,
    no_hp,
    email,
    alamat,
    catatan,
    payment_method
  } = req.body;

  if (!user_id || !nama || !no_hp || !email || !alamat) {
    return res.status(400).json({ message: "Data pelanggan wajib diisi" });
  }

  try {
    // Ambil keranjang user
    const [cartItems] = await db.query(
      "SELECT k.*, p.harga FROM keranjang k JOIN produk p ON k.produk_id = p.id WHERE k.user_id = ?",
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Keranjang kosong" });
    }

    // Insert setiap item ke tabel pesanan
    for (let item of cartItems) {
      const total_harga = item.jumlah * item.harga;
      await db.query(
        `INSERT INTO pesanan 
          (user_id, nama, no_hp, email, alamat, catatan, metode_pembayaran, total_harga, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
        [
          user_id,
          nama,
          no_hp,
          email,
          alamat,
          catatan || null,
          payment_method || "COD",
          total_harga
        ]
      );
    }

    // Kosongkan keranjang setelah checkout
    await db.query("DELETE FROM keranjang WHERE user_id = ?", [user_id]);

    res.json({
      message: "Checkout berhasil",
      jumlah_pesanan: cartItems.length,
      metode_pembayaran: payment_method || "COD"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat checkout" });
  }
});

module.exports = router;
