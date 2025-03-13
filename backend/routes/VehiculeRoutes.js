const express = require("express");
const{ addVehicule, getUserVehicules, updateVehicule, deleteVehicule} = require("../controllers/VehiculeController");
const authMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/", authMiddleware, addVehicule);
router.get("/", authMiddleware, getUserVehicules);
router.put("/:id", authMiddleware, updateVehicule);
router.delete("/:id", authMiddleware, deleteVehicule);

module.exports = router;