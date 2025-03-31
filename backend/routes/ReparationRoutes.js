const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const {
    createReparation,
    getReparationsByClient,
    demarrerReparation,
    terminerReparation
    } = require("../controllers/ReparationController");

router.post("/",authMiddleware, createReparation);
router.get('/',authMiddleware, getReparationsByClient);
router.put("/:id_reparation/demarrer",authMiddleware, demarrerReparation);
router.put("/:id_reparation/terminer",authMiddleware, terminerReparation);

module.exports = router;
