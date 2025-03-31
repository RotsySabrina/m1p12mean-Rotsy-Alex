const Reparation = require("../models/Reparation");
const ReparationService = require("../models/ReparationService");
const Devis = require("../models/Devis");
const RendezVousClient = require("../models/RendezVousClient");
const RendezVousService = require("../models/RendezVousService");

exports.createReparation = async (req, res) => {
    try {
        const { id_devis, id_mecanicien, services } = req.body;
        console.log("📩 Requête reçue pour créer une réparation:", req.body);

        const devis = await Devis.findById(id_devis);
        if (!devis) {
            // console.log("❌ Devis non trouvé avec ID:", id_devis);
            return res.status(404).json({ message: "Devis non trouvé" });
        }
        // console.log("✅ Devis trouvé:", devis);
        if (!services || !Array.isArray(services) || services.length === 0) {
            console.log("⚠️ Aucun service fourni dans la requête.");
            return res.status(400).json({ message: "Vous devez fournir des services pour créer une réparation" });
        }

        const reparation = new Reparation({
            id_devis,
            id_mecanicien,
            status: "en_attente"
        });

        const savedReparation = await reparation.save();

        const servicesToInsert = services.map(service => ({
            id_reparation: savedReparation._id,
            id_service: service.id, 
            status: "en_attente",
            observations: ""
        }));

        await ReparationService.insertMany(servicesToInsert);

        res.status(201).json({
            message: "Réparation créée avec succès",
            reparation: savedReparation
        });

    } catch (error) {
        console.error("💥 Erreur lors de la création de la réparation:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getReparationsByClient = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }

        const id_user = req.user.id;
        console.log(`🔍 Recherche des réparations pour le client : ${id_user}`);

        // Récupération des paramètres de pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const rendezVousIds = await RendezVousClient.find({ id_user }).distinct('_id');

        if (rendezVousIds.length === 0) {
            console.log("⚠️ Aucun rendez-vous trouvé.");
            return res.status(404).json({ message: "Aucune réparation trouvée." });
        }

        const devisIds = await Devis.find({ id_rendez_vous_client: { $in: rendezVousIds } }).distinct('_id');

        if (devisIds.length === 0) {
            console.log("⚠️ Aucun devis trouvé.");
            return res.status(404).json({ message: "Aucune réparation trouvée." });
        }

        const reparations = await Reparation.find({ id_devis: { $in: devisIds } })
            .populate('id_devis')
            .populate({
                path: 'id_devis',
                populate: {
                    path: 'id_rendez_vous_client',
                    populate: {
                        path: 'id_mecanicien',
                        select: 'nom email'
                    }
                }
            })
            .skip(skip)
            .limit(limit);

        if (reparations.length === 0) {
            console.log("⚠️ Aucune réparation trouvée.");
            return res.status(404).json({ message: "Aucune réparation trouvée." });
        }

        const rendezVousServices = await RendezVousService.find({ id_rendez_vous_client: { $in: rendezVousIds } })
            .populate('id_service');

        const reparationsAvecServices = reparations.map(rep => {
            const servicesAssocies = rendezVousServices
                .filter(rs => rs.id_rendez_vous_client.equals(rep.id_devis.id_rendez_vous_client))
                .map(rs => rs.id_service);

            return { ...rep.toObject(), services: servicesAssocies };
        });
        res.json({ 
            total: reparationsAvecServices.length, 
            page, 
            limit, 
            reparations: reparationsAvecServices 
        });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des réparations :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

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
