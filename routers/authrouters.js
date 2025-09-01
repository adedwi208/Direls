const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authcontrollers");

// route register
router.post("/register", register);

// route login
router.post("/login", login);

module.exports = router;
