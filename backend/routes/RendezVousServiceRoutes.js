const express = require("express");
const router = express.Router();
const {
    insertRendezVousServices,
    selectRendezVousServices,
    getServicesByCategoryForRdv
} = require("../controllers/RendezVousServiceController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, insertRendezVousServices);
router.get("/get_rdv_services/:id_rendez_vous_client", authMiddleware, selectRendezVousServices);
router.get("/:id_rendez_vous_client", authMiddleware, getServicesByCategoryForRdv);

module.exports = router;
