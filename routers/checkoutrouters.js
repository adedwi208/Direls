const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", async (req, res) => {
    // Ambil data dari body
    const { order_id, user_id, total_amount, payment_method } = req.body;

    // Validasi wajib
    if (!order_id || !user_id || !total_amount) {
        return res.status(400).json({ message: "Data checkout wajib diisi" });
    }

    try {
        // Masukkan ke tabel checkout sesuai nama kolom di DB
        await db.query(
            "INSERT INTO checkout (order_id, user_id, total_amount, payment_method, admin_no, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [order_id, user_id, total_amount, payment_method || "Tunai", "08123456789"]
        );

        // Kosongkan keranjang user setelah checkout
        await db.query("DELETE FROM keranjang WHERE user_id = ?", [user_id]);

        // Response ke frontend
        res.json({
            resi: order_id,
            payment_method: payment_method || "Tunai",
            admin_no: "08123456789"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

module.exports = router;
