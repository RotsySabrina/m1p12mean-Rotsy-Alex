const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const {mettreAJourStatutService, getServicesByReparationId} = require("../controllers/ReparationServiceController");

router.put("/:id_service", authMiddleware, mettreAJourStatutService);
router.get('/services/:id_reparation', authMiddleware, getServicesByReparationId);

module.exports = router;
