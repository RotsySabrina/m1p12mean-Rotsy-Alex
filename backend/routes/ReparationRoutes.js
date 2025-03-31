const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const {
    createReparation,
    getReparationsByClient,
    getReparationsByMecanicien,
    mettreAJourStatutReparation,
    demarrerReparation,
    terminerReparation
    } = require("../controllers/ReparationController");

router.post("/",authMiddleware, createReparation);
router.get('/',authMiddleware, getReparationsByClient);
router.get('/reparation_mecanicien',authMiddleware, getReparationsByMecanicien);
router.put("/a_jour/:id_reparation",authMiddleware, mettreAJourStatutReparation);

router.put("/:id_reparation/demarrer",authMiddleware, demarrerReparation);
router.put("/:id_reparation/terminer",authMiddleware, terminerReparation);

module.exports = router;
