const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User
exports.register = async (req, res) => {
  try {
    const { nama, nohp, email, password } = req.body;

    if (!nama || !nohp || !email || !password) {
      return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    // cek email sudah ada
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user baru
    await db.query(
      "INSERT INTO users (nama, nohp, email, password) VALUES (?, ?, ?, ?)",
      [nama, nohp, email, hashedPassword]
    );

    res.status(201).json({ message: "Registrasi berhasil!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

// Login User
// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi!" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Email tidak ditemukan!" });
    }

    const user = rows[0];

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Password salah!" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil!",
      token,
      role: user.role, // supaya bisa redirect ke admin / produk
      user: {
        id: user.id,
        nama: user.nama,
        nohp: user.nohp,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

