const Reparation = require("../models/Reparation");
const ReparationService = require("../models/ReparationService");
const Devis = require("../models/Devis");

// 📌 Créer une réparation après acceptation d’un devis
exports.creerReparation = async (req, res) => {
    try {
        const { id_devis, id_mecanicien } = req.body;

        // Vérifier si le devis existe et est accepté
        const devis = await Devis.findById(id_devis);
        if (!devis || devis.status !== "accepte") {
            return res.status(400).json({ message: "Devis non trouvé ou non accepté" });
        }

        // Créer la réparation globale
        const reparation = new Reparation({
            id_devis,
            id_mecanicien,
            status: "en_attente",
            date_debut: null,
            date_fin: null,
            observations: ""
        });

        await reparation.save();

        res.status(201).json(reparation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Démarrer une réparation
exports.demarrerReparation = async (req, res) => {
    try {
        const { id_reparation } = req.params;

        const reparation = await Reparation.findByIdAndUpdate(
            id_reparation,
            { status: "en_cours", date_debut: new Date() },
            { new: true }
        );

        if (!reparation) {
            return res.status(404).json({ message: "Réparation non trouvée" });
        }

        res.json(reparation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Terminer une réparation (vérifie si tous les services sont terminés)
exports.terminerReparation = async (req, res) => {
    try {
        const { id_reparation } = req.params;

        const servicesEnCours = await ReparationService.find({
            id_reparation,
            status: { $ne: "terminee" }
        });

        if (servicesEnCours.length > 0) {
            return res.status(400).json({ message: "Tous les services ne sont pas encore terminés" });
        }

        const reparation = await Reparation.findByIdAndUpdate(
            id_reparation,
            { status: "terminee", date_fin: new Date() },
            { new: true }
        );

        res.json(reparation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
