// controllers/pesananController.js
const db = require("../config/db");

exports.getUserRiwayat = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID wajib dikirim" });
    }

    const [rows] = await db.query(
      `SELECT p.id, p.nama_produk, p.jumlah, p.total_harga, p.metode_pembayaran, 
              p.status, p.created_at
       FROM pesanan p
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error getUserRiwayat:", err.message);
    res.status(500).json({ message: "Gagal ambil riwayat pesanan user" });
  }
};
