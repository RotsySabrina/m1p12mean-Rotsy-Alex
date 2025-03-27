const express = require("express");
const router = express.Router();
const {
    createRendezVousWithCategorieServices,
    getRendezVousByClientWithCategorieServices,
    updateRendezVousMecanicien,
    getUpcomingRendezVous,
    getRendezVousMecanicien,
    updateRendezVous,
    cancelRendezVous,
    getRendezVousByClient, getStatistiques
} = require("../controllers/RendezVousClientController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post('/', authMiddleware, createRendezVousWithCategorieServices);
router.get('/', authMiddleware, getRendezVousByClientWithCategorieServices);
router.put("/ajout-meca",authMiddleware,updateRendezVousMecanicien);
router.get("/rendez-vous-a-venir",authMiddleware,getUpcomingRendezVous);
router.get("/rendez-vous-mecanicien",authMiddleware,getRendezVousMecanicien);
router.get("/statistiques", authMiddleware, getStatistiques);


// router.put("/:id", authMiddleware, updateRendezVous);
// router.put("/:id/cancel", authMiddleware, cancelRendezVous);
// router.get("/", authMiddleware, getRendezVousByClient);

module.exports = router;
