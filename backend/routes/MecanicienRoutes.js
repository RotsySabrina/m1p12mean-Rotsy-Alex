const express = require("express");
const router = express.Router();
const { addMecanicien } = require("../controllers/MecanicienController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, addMecanicien);

module.exports = router;
