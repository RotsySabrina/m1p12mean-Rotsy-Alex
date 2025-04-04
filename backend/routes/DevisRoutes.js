const express = require("express");
const router = express.Router();
const {
    createDevis,
    calculerDevis,
    getDevisByClientId,
    updateStatus,
    getTauxRefusDevis
} = require("../controllers/DevisController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, createDevis);
router.post("/calcul", authMiddleware, calculerDevis);
router.get("/client", authMiddleware, getDevisByClientId);
router.put("/:id", authMiddleware,updateStatus);
router.get("/stat", authMiddleware, getTauxRefusDevis);


module.exports = router;
