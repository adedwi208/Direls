const db = require("../config/db");

// ambil semua produk
exports.getAllProduk = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produk");
    res.json(rows);
  } catch (err) {
    console.error("Error getAllProduk:", err);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
};

// ambil produk by id
exports.getProdukById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produk WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error getProdukById:", err);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
};

// ambil kemasan dari field varian
exports.getKemasanByProduk = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT varian FROM produk WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Produk tidak ditemukan" });

    // varian disimpan dalam JSON
    let varian = [];
    try {
      varian = JSON.parse(rows[0].varian || "[]");
    } catch (err) {
      console.error("Error parsing varian:", err);
    }

    // filter hanya yang jenisnya kemasan
    const kemasan = varian.filter(v => v.jenis === "kemasan");
    res.json(kemasan);
  } catch (err) {
    console.error("Error getKemasanByProduk:", err);
    res.status(500).json({ message: "Gagal mengambil kemasan" });
  }
};

