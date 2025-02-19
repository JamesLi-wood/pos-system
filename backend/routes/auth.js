const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authRoutes");

router.get("/signup", signup);

router.post("/login", login);

module.exports = router;
