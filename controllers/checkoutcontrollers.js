const db = require("../config/db");

exports.createCheckout = async (req, res) => {
  try {
    const {
      user_id, nama, no_hp, email, alamat, catatan, payment_method
    } = req.body;

    if (!user_id) return res.status(400).json({ message: "Data pelanggan wajib diisi" });

    const admin_no = "08123456789"; // Nomor admin tetap atau ambil dari DB

    // Ambil semua item keranjang user
    const [cartItems] = await db.query(
      "SELECT k.*, p.harga FROM keranjang k JOIN produk p ON k.produk_id = p.id WHERE k.user_id = ?",
      [user_id]
    );

    // Insert tiap item ke tabel pesanan
    for (let item of cartItems) {
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
          catatan,
          payment_method || "COD",
          item.jumlah * item.harga
        ]
      );
    }

    // Kosongkan keranjang
    await db.query("DELETE FROM keranjang WHERE user_id = ?", [user_id]);

    // Kirim response lengkap termasuk admin_no
    res.json({
      resi: Date.now(), // bisa diganti dengan order_id kalau ada
      payment_method: payment_method || "COD",
      admin_no
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal checkout" });
  }
};

