const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const { getAllCreneaux, addRegleCrenaux, getCreneauxDisponibles, updateRegleCreneau } = require("../controllers/CreneauxController");

router.post("/", authMiddleware, addRegleCrenaux);
router.post("/creneaux-dispo", authMiddleware, getCreneauxDisponibles);
router.put("/:id", authMiddleware, updateRegleCreneau); // Route pour la mise à jour d'une règle de créneau
router.get("/", authMiddleware, getAllCreneaux);

module.exports = router;

