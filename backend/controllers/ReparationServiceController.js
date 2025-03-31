const ReparationService = require("../models/ReparationService");

// 📌 Mettre à jour le statut d'un service dans la réparation
exports.mettreAJourStatutService = async (req, res) => {
    try {
        const { id_service } = req.params;
        const { status, observations } = req.body;

        const service = await ReparationService.findByIdAndUpdate(
            id_service,
            { status, observations },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
