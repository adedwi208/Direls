const db = require("../config/db");

// Tambah produk
exports.tambahProduk = async (req, res) => {
  try {
    const { kategori, nama, deskripsi, harga, varian } = req.body;
    let foto = null;
    if (req.file) foto = req.file.filename;

    const [result] = await db.query(
      "INSERT INTO produk (kategori, nama, deskripsi, harga, foto, varian) VALUES (?, ?, ?, ?, ?, ?)",
      [kategori, nama, deskripsi, harga, foto, varian || null]
    );

    res.status(201).json({ message: "Produk berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
};

// Ambil riwayat pesanan
// controllers/admincontrollers.js

exports.getRiwayat = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, user_id, nama_produk, nama, no_hp, email, alamat, catatan, metode_pembayaran, jumlah, total_harga, status, created_at
      FROM pesanan
      WHERE status = 'diproses' OR status = 'selesai'
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error getRiwayat:", err.message);
    res.status(500).json({ message: "Gagal ambil riwayat pesanan" });
  }
};







// Ambil pesanan masuk
exports.getPesananMasuk = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, user_id, nama_produk, nama, no_hp, email, alamat, catatan, metode_pembayaran, jumlah, total_harga, status, created_at
      FROM pesanan
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error getPesananMasuk:", err.message);
    res.status(500).json({ message: "Gagal mengambil pesanan masuk" });
  }
};



// Proses pesanan
exports.prosesPesanan = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE pesanan SET status = 'diproses' WHERE id = ?", [id]);
    res.json({ message: "Pesanan berhasil diproses" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memproses pesanan" });
  }
};

// Ambil pelanggan
exports.getPelanggan = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, nama, email, nohp, role, created_at
      FROM users
      WHERE role = 'user'
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error getPelanggan:", err.message);
    res.status(500).json({ message: "Gagal ambil data pelanggan" });
  }
};

