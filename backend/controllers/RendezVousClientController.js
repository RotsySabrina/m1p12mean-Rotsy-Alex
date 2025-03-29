const RendezVousClient = require("../models/RendezVousClient");
const RendezVousCategorieService = require("../models/RendezVousCategorieService");
const CategorieService = require("../models/CategorieService");

const mongoose = require("mongoose");
const User = require("../models/User");

exports.createRendezVousWithCategorieServices = async (req, res) => {
    try {
        const { id_vehicule, date_heure, catServices } = req.body;

        if (!id_vehicule || !date_heure || !catServices || catServices.length === 0) {
            return res.status(400).json({ message: "id_vehicule, date_heure et catServices sont requis" });
        }

        const services = await CategorieService.find({ _id: { $in: catServices } });
        if (services.length !== catServices.length) {
            return res.status(400).json({ message: "Un ou plusieurs services sélectionnés n'existent pas" });
        }

        let duree_totale = services.reduce((sum, service) => sum + service.duree, 0);

        const newRdv = new RendezVousClient({
            id_user: req.user.id,
            id_vehicule,
            date_heure,
            duree_totale
        });

        const savedRdv = await newRdv.save();

        const catServicesAssocies = services.map(service => ({
            id_rendez_vous_client: savedRdv._id,
            id_categorie_service: service._id
        }));

        await RendezVousCategorieService.insertMany(catServicesAssocies);

        res.status(201).json({ message: "Rendez-vous et services ajoutés avec succès", savedRdv });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du rendez-vous", error });
    }
};

exports.getRendezVousByClientWithCategorieServices = async (req, res) => {
    try {
        const id_user = req.user.id;

        const rendezVous = await RendezVousClient.find({ id_user })
            .sort({ date_heure: -1 })
            .populate("id_vehicule")
            .lean();

        console.log("Rendez-vous trouvés :", rendezVous.length);
        if (!rendezVous.length) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé pour ce client." });
        }

        for (let rdv of rendezVous) {
            const servicesAssocies = await RendezVousCategorieService.find({ id_rendez_vous_client: rdv._id })
                .populate("id_categorie_service")
                .lean();

            if (!servicesAssocies.length) {
                rdv.CategorieServices = [];
                continue;
            }

            rdv.CategorieServices = servicesAssocies.map(s => s.id_categorie_service);
        }

        console.log("Résultat final des rendez-vous :", JSON.stringify(rendezVous, null, 2));
        res.status(200).json({ rendezVous });
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous", error: error.message || error });
    }
};

exports.updateRendezVousMecanicien = async (req, res) => {
    try {
        console.log("Requête reçue :", req.body);
        const { rendezVousId, mecanicienId } = req.body;

        const rendezVous = await RendezVousClient.findById(rendezVousId);
        console.log("rendezVous :", rendezVous);

        if (!rendezVous) {
            return res.status(404).json({ success: false, message: "Rendez-vous non trouvé" });
        }

        const mecanicien = await User.findById(mecanicienId);
        console.log("mecanicien :", mecanicien);

        if (!mecanicien) {
            return res.status(404).json({ success: false, message: "Mécanicien non trouvé" });
        }

        rendezVous.id_mecanicien = mecanicienId;
        await rendezVous.save();

        return res.status(200).json({
            success: true,
            message: "Mécanicien ajouté avec succès",
            data: rendezVous
        });

    } catch (error) {
        console.error("Erreur lors de la mise à jour du rendez-vous :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur", error });
    }
};

exports.getUpcomingRendezVous = async (req, res) => {
    try {
        const now = new Date();

        const upcomingRendezVous = await RendezVousClient.find({ date_heure: { $gte: now } })
            .populate("id_user", "nom prenom email")
            .populate("id_vehicule", "marque modele immatriculation annee")
            .populate("id_mecanicien", "nom specialisation")
            .sort({ date_heure: 1 });

        const rendezVousIds = upcomingRendezVous.map(rdv => rdv._id);

        const categories = await RendezVousCategorieService.find({ id_rendez_vous_client: { $in: rendezVousIds } })
            .populate("id_categorie_service", "nom description");

        const rendezVousAvecCategories = upcomingRendezVous.map(rdv => {
            return {
                ...rdv.toObject(),
                categories: categories
                    .filter(cat => cat.id_rendez_vous_client.toString() === rdv._id.toString())
                    .map(cat => cat.id_categorie_service) // Ne garder que les infos de la catégorie
            };
        });

        return res.status(200).json({
            success: true,
            message: "Liste des rendez-vous à venir",
            data: rendezVousAvecCategories
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous à venir :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error
        });
    }
};

exports.getRendezVousMecanicien = async (req, res) => {
    try {
        const mecanicienId = req.user.id;

        const now = new Date();
        const rendezVous = await RendezVousClient.find({
            id_mecanicien: mecanicienId,
            date_heure: { $gte: now }
        })
            .populate("id_user", "nom prenom email")
            .populate("id_vehicule", "marque modele immatriculation")
            .sort({ date_heure: 1 });

        const rendezVousIds = rendezVous.map(rdv => rdv._id);
        const categories = await RendezVousCategorieService.find({ id_rendez_vous_client: { $in: rendezVousIds } })
            .populate("id_categorie_service", "nom description");

        const rendezVousAvecCategories = rendezVous.map(rdv => ({
            ...rdv.toObject(),
            categories: categories
                .filter(cat => cat.id_rendez_vous_client.toString() === rdv._id.toString())
                .map(cat => cat.id_categorie_service)
        }));

        return res.status(200).json({
            success: true,
            message: "Liste des rendez-vous à venir pour le mécanicien",
            data: rendezVousAvecCategories
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous du mécanicien :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error
        });
    }
};

//Modifier un rendez-vous
exports.updateRendezVous = async (req, res) => {
    try {
        const { date_heure, probleme_specifique, status } = req.body;

        const updatedRdv = await RendezVousClient.findByIdAndUpdate(
            req.params.id,
            { date_heure, probleme_specifique, status },
            { new: true }
        );

        if (!updatedRdv) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        res.status(200).json({ message: "Rendez-vous mis à jour", updatedRdv });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Annuler un rendez-vous
exports.cancelRendezVous = async (req, res) => {
    try {
        const rdv = await RendezVousClient.findById(req.params.id);

        if (!rdv) {
            return res.status(404).json({ message: "Rendez-vous non trouvé" });
        }

        rdv.status = "annulé";
        await rdv.save();

        res.status(200).json({ message: "Rendez-vous annulé", rdv });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Lister les rendez-vous d'un client
exports.getRendezVousByClient = async (req, res) => {
    try {
        const rdvs = await RendezVousClient.find({ id_user: req.user.id }).populate("id_vehicule");
        res.status(200).json(rdvs);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getStatistiques = async (req, res) => {
    try {
        const { annee } = req.query;

        // Convertir la valeur de l'année en entier
        const year = parseInt(annee);

        // Vérifier que l'année est valide
        if (isNaN(year)) {
            return res.status(400).json({ message: "Année requise et doit être un nombre valide." });
        }

        // Créer un tableau pour stocker le nombre de rendez-vous pour chaque mois
        let moisTotaux = Array(12).fill(0);

        // Filtrer les rendez-vous par année
        const rendezVous = await RendezVousClient.find({
            date_heure: {
                $gte: new Date(year, 0, 1), // Début de l'année
                $lt: new Date(year + 1, 0, 1) // Début de l'année suivante
            }
        });

        // Log des rendez-vous récupérés
        console.log("Rendez-vous récupérés:", rendezVous);

        // Calculer le nombre de rendez-vous pour chaque mois
        rendezVous.forEach((rendezvous) => {
            const mois = new Date(rendezvous.date_heure).getMonth();  // Récupérer le mois (0-11)
            moisTotaux[mois] += 1; // Incrémenter le total du mois
        });

        // Log des totaux mensuels
        console.log("Totaux mensuels:", moisTotaux);

        // Créer un tableau de mois avec les totaux
        const moisData = moisTotaux.map((total, index) => {
            return {
                mois: index + 1, // Mois (1 à 12)
                count: total // Nombre total de rendez-vous pour ce mois
            };
        });

        // Log des données qui seront envoyées au frontend
        console.log("Données envoyées au frontend:", moisData);

        // Retourner les totaux pour chaque mois sous forme de tableau d'objets
        res.status(200).json({
            moisTotaux: moisData,  // Tableau des totaux par mois avec mois et nombre
        });
    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

