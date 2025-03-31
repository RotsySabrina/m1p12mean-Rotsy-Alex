const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const {mettreAJourStatutService} = require("../controllers/ReparationServiceController");

router.put("/:id_service", authMiddleware, mettreAJourStatutService);

module.exports = router;
