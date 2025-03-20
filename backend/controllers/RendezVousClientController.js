const RendezVousClient = require("../models/RendezVousClient");
const RendezVousService = require("../models/RendezVousService");
const RendezVousCategorieService = require("../models/RendezVousCategorieService");
const Service = require("../models/Service");

const mongoose = require("mongoose");

// Créer un rendez-vous
exports.createRendezVousWithCategorieServices = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id_vehicule, date_heure, duree_totale, catServices } = req.body;
        const newRdv = new RendezVousClient({
            id_user: req.user.id,
            id_vehicule,
            date_heure,
            duree_totale
        });

        const savedRdv = await newRdv.save({ session });
        console.log("Rendez-vous créé:", savedRdv);  
        console.log("categorie services:", catServices); 
        if (catServices && catServices.length > 0) {
            const catServicesAssocies = catServices.map(serviceId => ({
                id_rendez_vous_client: savedRdv._id,
                id_categorie_service: serviceId
            }));
            console.log("catServicesAssocies:", catServicesAssocies); 

            await RendezVousCategorieService.insertMany(catServicesAssocies, { session });
             
            
        }

        await session.commitTransaction();
        session.endSession();
        
        res.status(201).json({ message: "Rendez-vous et catServices ajoutés avec succès", savedRdv });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ message: "Erreur lors de l'ajout du rendez-vous", error });
    }
};

// rendez-vous d'un client avec catServices associés
exports.getRendezVousByClientWithServices = async (req, res) => {
    try {
        const id_user = req.user.id; 

        const rendezVous = await RendezVousClient.find({ id_user })
            .sort({ date_heure: -1 })
            .lean();

        if (!rendezVous.length) {
            return res.status(404).json({ message: "Aucun rendez-vous trouvé pour ce client." });
        }

        for (let rdv of rendezVous) {
            const servicesAssocies = await RendezVousService.find({ id_rendez_vous_client: rdv._id })
                .populate("id_service") 
                .lean();

            if (!servicesAssocies.length) {
                rdv.services = [];
                continue;
            }
            rdv.services = servicesAssocies.map(s => s.id_service);
        }
        res.status(200).json({ rendezVous });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous", error: error.message || error });
    }
};

exports.calculerDevis = async (req, res) => {
    try {
        const { services } = req.body;

        console.log("Services sélectionnés pour le devis:", services);

        if (!services || services.length === 0) {
            return res.status(400).json({ message: "Aucun service sélectionné." });
        }

        const serviceDetails = await Service.find({ _id: { $in: services } });

        console.log("Détails des services trouvés:", serviceDetails);

        if (!serviceDetails.length) {
            return res.status(404).json({ message: "Aucun service trouvé." });
        }

        const total = serviceDetails.reduce((acc, service) => acc + service.cout, 0);

        console.log("Total du devis:", total);

        res.status(200).json({ total, services: serviceDetails });
    } catch (error) {
        console.error("Erreur lors du calcul du devis:", error);
        res.status(500).json({ message: "Erreur lors du calcul du devis", error });
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
