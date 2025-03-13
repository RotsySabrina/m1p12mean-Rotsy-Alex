const express = require("express");
const router = express.Router();
const {
    createRendezVous,
    updateRendezVous,
    cancelRendezVous,
    getRendezVousByClient
} = require("../controllers/RendezVousClientController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, createRendezVous);
router.put("/:id", authMiddleware, updateRendezVous);
router.put("/:id/cancel", authMiddleware, cancelRendezVous);
router.get("/", authMiddleware, getRendezVousByClient);

module.exports = router;
