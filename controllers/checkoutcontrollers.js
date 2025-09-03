const db = require("../config/db");

exports.createCheckout = async (req, res) => {
  try {
    const {
      user_id, nama, no_hp, email, alamat, catatan, payment_method
    } = req.body;

    if (!user_id) return res.status(400).json({ message: "Data pelanggan wajib diisi" });

    const admin_no = "+62 857-1588-3165"; // Nomor admin tetap atau ambil dari DB

    // Ambil semua item keranjang user
    // Ambil semua item keranjang user + nama produk
const [cartItems] = await db.query(
  `SELECT k.*, p.harga, p.nama AS nama_produk 
   FROM keranjang k 
   JOIN produk p ON k.produk_id = p.id 
   WHERE k.user_id = ?`,
  [user_id]
);



// Insert tiap item ke tabel pesanan
for (let item of cartItems) {
  await db.query(
  `INSERT INTO pesanan 
   (user_id, produk_id, nama_produk, nama, no_hp, email, alamat, catatan, metode_pembayaran, jumlah, total_harga, status, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
  [
    user_id,
    item.produk_id,       // masih simpan id produk
    item.nama_produk,     // langsung simpan nama produk
    nama,
    no_hp,
    email,
    alamat,
    catatan || null,
    payment_method || "COD",
    item.jumlah,
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

