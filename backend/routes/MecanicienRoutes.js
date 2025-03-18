const express = require("express");
const router = express.Router();
const { addMecanicien, getAllMecaniciens, updateMecanicien, deleteMecanicien } = require("../controllers/MecanicienController");
const authMiddleware = require("../middleware/AuthMiddleware");

router.post("/", authMiddleware, addMecanicien);
router.get("/", authMiddleware, getAllMecaniciens);
router.put("/:id", authMiddleware, updateMecanicien);
router.delete("/:id", authMiddleware, deleteMecanicien);

module.exports = router;
