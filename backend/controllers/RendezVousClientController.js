const RendezVousClient = require("../models/RendezVousClient");
const RendezVousService = require("../models/RendezVousService");

// Créer un rendez-vous
exports.createRendezVous = async (req, res) => {
    try {
        const { id_vehicule, date_heure, probleme_specifique } = req.body;

        const newRdv = new RendezVousClient({
            id_user: req.user.id, 
            id_vehicule,
            date_heure,
            probleme_specifique,
            status: "en attente"
        });

        await newRdv.save();
        res.status(201).json({ message: "Rendez-vous créé avec succès", newRdv });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//rendez vous avec services
exports.createRendezVousWithServices = async (req, res) =>{
    try {
        const {id_vehicule, date_heure, probleme_specifique, services} = req.body;
        req.user = { id: req.user.id || req.body.id_user };
        await exports.createRendezVous(req, res);

        const rendezVous = await RendezVousClient.findone({id_user: req.user.id}).sort({date_heure: -1});
        if (!rendezVous) {
            return res.status(400).json({ message: "Impossible de récupérer le rendez-vous" });
        }

        if(services && services.length > 0){
            const servicesAssocies = services.map(serviceId =>({
                id_rendez_vous_client: rendezVous._id,
                id_service: serviceId,
            }));
        await RendezVousService.insertMany(servicesAssocies);
        }
        res.status(201).json({ message: "Rendez-vous et services ajoutés avec succès", rendezVous });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du rendez-vous", error });
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
