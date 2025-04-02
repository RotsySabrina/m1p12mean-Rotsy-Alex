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
        // console.log(`🔍 Recherche des réparations pour le client : ${id_user}`);

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

exports.getReparationsByMecanicien = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Utilisateur non authentifié." });
        }

        const id_user = req.user.id;
        // console.log(`🔍 Recherche des réparations pour le mécanicien : ${id_user}`);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 🔹 Récupérer les réparations du mécanicien
        const reparations = await Reparation.find({ id_mecanicien: id_user })
            .populate({
                path: 'id_devis',
                populate: {
                    path: 'id_rendez_vous_client',
                    populate: [
                        { path: 'id_user', select: 'nom prenom' },  // Nom du client
                        { path: 'id_vehicule', select: 'marque modele immatriculation annee' }  // Véhicule
                    ]
                }
            })
            .skip(skip)
            .limit(limit);

        if (reparations.length === 0) {
            console.log("⚠️ Aucune réparation trouvée.");
            return res.status(404).json({ message: "Aucune réparation trouvée." });
        }

        // 🔹 Reformater les réparations pour inclure uniquement les infos nécessaires
        const reparationsAvecDetails = reparations.map(rep => ({
            _id: rep._id,
            id_devis: rep.id_devis._id,
            montant_total: rep.id_devis.montant_total,
            date_devis: rep.id_devis.date_devis,
            status: rep.status,
            createdAt: rep.createdAt,
            updatedAt: rep.updatedAt,
            client: rep.id_devis.id_rendez_vous_client?.id_user || null,
            vehicule: rep.id_devis.id_rendez_vous_client?.id_vehicule || null
        }));

        // console.log(`✅ ${reparationsAvecDetails.length} réparations trouvées avec client et véhicule.`);

        res.json({
            total: reparationsAvecDetails.length,
            page,
            limit,
            reparations: reparationsAvecDetails
        });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des réparations :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.getAllReparations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // console.log(`🔍 Récupération de toutes les réparations (Page ${page}, Limit ${limit})`);
        const reparations = await Reparation.find()
            .populate('id_mecanicien', 'nom prenom')  // Récupérer le mécanicien
            .populate({
                path: 'id_devis',
                populate: {
                    path: 'id_rendez_vous_client',
                    populate: [
                        { path: 'id_user', select: 'nom prenom' },  // Client
                        { path: 'id_vehicule', select: 'marque modele immatriculation annee' }  // Véhicule
                    ]
                }
            })
            .skip(skip)
            .limit(limit);

        if (reparations.length === 0) {
            console.log("⚠️ Aucune réparation trouvée.");
            return res.status(404).json({ message: "Aucune réparation trouvée." });
        }

        // 🔹 Reformater les réparations pour un retour structuré
        const reparationsAvecDetails = reparations.map(rep => ({
            _id: rep._id,
            id_devis: rep.id_devis?._id || null,
            montant_total: rep.id_devis?.montant_total || null,
            date_devis: rep.id_devis?.date_devis || null,
            status: rep.status,
            createdAt: rep.createdAt,
            updatedAt: rep.updatedAt,
            mecanicien: rep.id_mecanicien || null,
            client: rep.id_devis?.id_rendez_vous_client?.id_user || null,
            vehicule: rep.id_devis?.id_rendez_vous_client?.id_vehicule || null
        }));
        // console.log(`✅ ${reparationsAvecDetails.length} réparations récupérées avec mécanicien, client et véhicule.`);
        res.json({
            total: reparationsAvecDetails.length,
            page,
            limit,
            reparations: reparationsAvecDetails
        });

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des réparations :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.mettreAJourStatutReparation = async (req, res) => {
    try {
        const { id_reparation } = req.params;

        // Récupérer tous les services liés à cette réparation
        const services = await ReparationService.find({ id_reparation });

        if (services.length === 0) {
            return res.status(404).json({ message: "Aucun service trouvé pour cette réparation." });
        }

        // Vérifier les statuts des services
        const estEnCours = services.some(service => service.status === "en cours");
        const tousTermines = services.every(service => service.status === "terminee");

        let nouveauStatut = "en attente";
        if (tousTermines) {
            nouveauStatut = "terminee";
        } else if (estEnCours) {
            nouveauStatut = "en cours";
        }

        // Mettre à jour le statut de la réparation
        const reparation = await Reparation.findByIdAndUpdate(
            id_reparation, 
            { status: nouveauStatut }, 
            { new: true }
        ).populate("id_devis"); // Peupler id_devis pour récupérer les informations du devis

        if (!reparation) {
            return res.status(404).json({ message: "Réparation non trouvée." });
        }

        // Si la réparation est terminée, renvoyer aussi l'id_devis pour générer la facture
        res.json({ 
            message: "Statut de la réparation mis à jour.", 
            status: reparation.status,
            id_devis: reparation.id_devis ? reparation.id_devis._id : null 
        });

    } catch (error) {
        console.error("❌ Erreur mise à jour statut réparation :", error);
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
