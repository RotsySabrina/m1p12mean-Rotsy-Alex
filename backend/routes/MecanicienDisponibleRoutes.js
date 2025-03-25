const express = require("express");
const router = express.Router();
const { addMecanicienDisponible, getDisponibilites, updateDisponibilite, deleteDisponibilite } = require("../controllers/MecanicienDisponibleController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, addMecanicienDisponible);
router.get("/", authMiddleware, getDisponibilites);
router.put("/:id", authMiddleware, updateDisponibilite);
router.delete("/:id", authMiddleware, deleteDisponibilite);

module.exports = router;
