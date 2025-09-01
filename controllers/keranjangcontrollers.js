const db = require("../config/db"); // pastikan koneksi MySQL

// GET isi keranjang
exports.getKeranjang = async (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ error: "user_id wajib diisi" });

    try {
        const [rows] = await db.query(`
            SELECT k.id, k.jumlah, k.kemasan,
                   p.id AS produk_id, p.nama AS nama_produk, p.kategori, p.harga, p.foto
            FROM keranjang k
            JOIN produk p ON k.produk_id = p.id
            WHERE k.user_id = ?
        `, [user_id]);

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal mengambil data keranjang" });
    }
};

// POST tambah ke keranjang
exports.addToKeranjang = async (req, res) => {
    const { user_id, produk_id, jumlah, kemasan } = req.body;
    console.log("REQ.BODY:", req.body); // cek apakah jumlah masuk

    if (!user_id || !produk_id || !jumlah) {
        return res.status(400).json({ error: "user_id, produk_id, jumlah wajib diisi" });
    }

    try {
        await db.query(
            "INSERT INTO keranjang (user_id, produk_id, jumlah, kemasan) VALUES (?, ?, ?, ?)",
            [user_id, produk_id, jumlah, kemasan || null]
        );
        res.json({ message: "Berhasil tambah keranjang" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal tambah keranjang" });
    }
};


// DELETE hapus item keranjang
exports.deleteFromKeranjang = async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "id wajib diisi" });

    try {
        await db.query("DELETE FROM keranjang WHERE id = ?", [id]);
        res.json({ message: "Item berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal hapus item" });
    }
};
