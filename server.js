require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// koneksi database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const authRoutes = require("./routers/authrouters");
app.use("/api/admin", require("./routers/adminrouters"));
const produkRoutes = require("./routers/produkrouters");
const keranjangRoutes = require("./routers/keranjangrouters");
const checkoutRoutes = require("./routers/checkoutrouters");





app.use("/api/checkout", checkoutRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/keranjang", keranjangRoutes);

// contoh upload dengan multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// endpoint upload
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

// start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
