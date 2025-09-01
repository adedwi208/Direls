const db = require("../config/db");

exports.createCheckout = async (req, res) => {
  try {
    const { user_id, order_id, total_amount, payment_method } = req.body;
    if (!user_id || !order_id || !total_amount) {
      return res.status(400).json({ message: "Data checkout wajib diisi" });
    }

    const admin_no = "08123456789"; // bisa diganti sesuai admin
    await db.query(
    "INSERT INTO checkout (user_id, order_id, total_amount, payment_method, admin_no) VALUES (?, ?, ?, ?, ?)",
    [user_id, order_id, total_amount, payment_method || "COD", admin_no]
    );

    res.json({
    resi: order_id,
    payment_method: payment_method || "COD", // ini cuma untuk frontend
    admin_no
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal checkout" });
  }
};
