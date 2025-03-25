const express = require("express");
const router = express.Router();
const {
    createRendezVousWithCategorieServices,
    getRendezVousByClientWithCategorieServices,
    updateRendezVousMecanicien,
    calculerDevis,
    updateRendezVous,
    cancelRendezVous,
    getRendezVousByClient, getStatistiques
} = require("../controllers/RendezVousClientController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post('/', authMiddleware, createRendezVousWithCategorieServices);
router.get('/', authMiddleware, getRendezVousByClientWithCategorieServices);
router.put("/ajout-meca",authMiddleware,updateRendezVousMecanicien);
router.post('/devis', authMiddleware, calculerDevis);
router.get("/statistiques", authMiddleware, getStatistiques);


// router.put("/:id", authMiddleware, updateRendezVous);
// router.put("/:id/cancel", authMiddleware, cancelRendezVous);
// router.get("/", authMiddleware, getRendezVousByClient);

module.exports = router;
