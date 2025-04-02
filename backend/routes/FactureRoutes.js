const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const { genererFacture, getFacturesByClient} = require("../controllers/FactureController");

router.post("/:id_devis", authMiddleware, genererFacture);
router.get("/factures", authMiddleware, getFacturesByClient);

module.exports = router;
