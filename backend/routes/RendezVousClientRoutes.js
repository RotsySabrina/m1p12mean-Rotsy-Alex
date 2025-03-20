const express = require("express");
const router = express.Router();
const {
    createRendezVousWithCategorieServices,
    getRendezVousByClientWithCategorieServices,
    calculerDevis,
    updateRendezVous,
    cancelRendezVous,
    getRendezVousByClient
} = require("../controllers/RendezVousClientController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post('/',authMiddleware,createRendezVousWithCategorieServices);
router.get('/',authMiddleware,getRendezVousByClientWithCategorieServices);
router.post('/devis',authMiddleware,calculerDevis);

// router.put("/:id", authMiddleware, updateRendezVous);
// router.put("/:id/cancel", authMiddleware, cancelRendezVous);
// router.get("/", authMiddleware, getRendezVousByClient);

module.exports = router;
