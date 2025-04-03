const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware"); // Vérifie que l'utilisateur est bien connecté
const { getUnreadNotifications, markAsRead } = require("../controllers/NotificationController")

router.get("/unread", authMiddleware, getUnreadNotifications);
router.put("/mark-as-read", authMiddleware, markAsRead);

module.exports = router;