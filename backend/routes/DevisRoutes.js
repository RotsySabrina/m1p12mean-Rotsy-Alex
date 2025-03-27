const express = require("express");
const router = express.Router();
const {
    createDevis,
    calculerDevis
} = require("../controllers/DevisController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, createDevis);
router.post("/calcul", authMiddleware, calculerDevis);

module.exports = router;
