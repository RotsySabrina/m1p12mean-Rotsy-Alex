const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const { addRegleCrenaux, getCreneauxDisponibles } = require("../controllers/CreneauxController");

router.post("/", authMiddleware, addRegleCrenaux);
router.post("/creneaux-dispo", authMiddleware, getCreneauxDisponibles);


module.exports = router;
