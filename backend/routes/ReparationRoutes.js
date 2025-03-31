const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const {
    creerReparation,
    demarrerReparation,
    terminerReparation
    } = require("../controllers/ReparationController");

router.post("/",authMiddleware,creerReparation);
router.put("/:id_reparation/demarrer",authMiddleware, demarrerReparation);
router.put("/:id_reparation/terminer",authMiddleware, terminerReparation);

module.exports = router;
