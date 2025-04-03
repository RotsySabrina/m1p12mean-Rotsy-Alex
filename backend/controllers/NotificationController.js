const Notification = require('../models/Notification');
const User = require('../models/User'); // Assurez-vous que ce modèle est importé

// exports.getUnreadNotifications = async (req, res) => {
//     try {
//         // Vérifier que l'utilisateur est bien un "manager"
//         console.log("ID de l'utilisateur connecté :", req.user.id);  // Log l'ID de l'utilisateur connecté
//         const user = await User.findById(req.user.id);

//         if (!user) {
//             console.log("Utilisateur introuvable.");  // Log si l'utilisateur n'est pas trouvé
//             return res.status(403).json({ message: 'Utilisateur introuvable.' });
//         }

//         console.log("Rôle de l'utilisateur :", user.role);  // Log le rôle de l'utilisateur

//         if (user.role !== 'manager') {
//             console.log("Accès refusé. L'utilisateur n'est pas un manager.");  // Log si l'utilisateur n'est pas un manager
//             return res.status(403).json({ message: 'Accès refusé. Seul un manager peut voir ces notifications.' });
//         }

//         // Filtrer les notifications non lues pour cet utilisateur (manager)
//         console.log("Recherche des notifications non lues pour l'utilisateur avec ID :", req.user.id);  // Log l'ID utilisé pour la recherche des notifications
//         const notifications = await Notification.find({ userId: req.user.id, isRead: false })
//             .sort({ createdAt: -1 }); // Trier par date décroissante

//         console.log("Notifications récupérées :", notifications);  // Log les notifications récupérées

//         res.status(200).json(notifications);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des notifications :", error);  // Log l'erreur si elle se produit
//         res.status(500).json({ message: "Erreur lors de la récupération des notifications", error });
//     }
// };

exports.getUnreadNotifications = async (req, res) => {
    try {
        console.log("ID de l'utilisateur connecté :", req.user.id);
        const user = await User.findById(req.user.id);

        if (!user) {
            console.log("Utilisateur introuvable.");
            return res.status(403).json({ message: 'Utilisateur introuvable.' });
        }

        console.log("Rôle de l'utilisateur :", user.role);

        // Vérifier le rôle de l'utilisateur pour décider quelles notifications récupérer
        let notifications;

        // Gestion des notifications pour les managers, mécaniciens, et clients
        if (user.role === 'manager' || user.role === 'mecanicien' || user.role === 'client') {
            console.log(`Accès ${user.role} : récupération des notifications non lues pour le ${user.role}`);
            notifications = await Notification.find({ userId: req.user.id, isRead: false })
                .sort({ createdAt: -1 });
        } else {
            console.log("Rôle non autorisé.");
            return res.status(403).json({ message: 'Accès refusé. Ce rôle ne peut pas voir les notifications.' });
        }

        console.log("Notifications récupérées :", notifications);
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error });
    }
};




exports.markAsRead = async (req, res) => {
    try {
        // Assurez-vous que l'utilisateur est un "manager"
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'manager') {
            return res.status(403).json({ message: 'Accès refusé. Seul un manager peut marquer les notifications comme lues.' });
        }

        // Marquer toutes les notifications non lues comme lues
        await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
        res.status(200).json({ message: "Toutes les notifications marquées comme lues" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour des notifications", error });
    }
};
