const Devis = require("../models/Devis");
const Reparation = require("../models/Reparation");
const RendezVousService = require("../models/RendezVousService");
const Facture = require ("../models/Facture");

exports.genererFacture = async (req, res) => {
    try {
        const { id_devis } = req.params;

        const devis = await Devis.findById(id_devis).populate('id_rendez_vous_client');

        if (!devis) {
            console.error("❌ [ERREUR] Devis introuvable.");
            return res.status(404).json({ message: "Devis introuvable." });
        }

        // Étape 2 : Vérifier s'il y a des réparations associées à ce devis
        const reparations = await Reparation.find({ id_devis });
        console.log(`🔎 [DEBUG] Réparations associées à ce devis :`, reparations);

        if (reparations.length === 0) {
            console.error("❌ [ERREUR] Aucune réparation associée au devis.");
            return res.status(400).json({ message: "Aucune réparation associée." });
        }

        // Étape 3 : Vérifier si les services du rendez-vous client existent
        const rendezVousServices = await RendezVousService.find({ id_rendez_vous_client: devis.id_rendez_vous_client })
            .populate('id_service');

        console.log(`🔎 [DEBUG] Services liés au rendez-vous client :`, rendezVousServices);

        if (rendezVousServices.length === 0) {
            console.error("❌ [ERREUR] Aucun service associé au rendez-vous.");
            return res.status(400).json({ message: "Aucun service associé au rendez-vous." });
        }

        // Étape 4 : Construire la liste des services et leurs coûts
        const services = rendezVousServices.map(s => ({
            id_service: s.id_service._id,
            nom_service: s.id_service.description,
            prix: s.id_service.cout
        }));

        console.log(`📝 [DEBUG] Liste des services facturés :`, services);

        // Étape 5 : Calculer le total de la facture
        const total = services.reduce((sum, s) => sum + s.prix, 0);
        console.log(`💰 [DEBUG] Montant total calculé : ${total}`);

        // Étape 6 : Créer la facture
        const facture = new Facture({
            id_devis: devis._id,
            id_client: devis.id_rendez_vous_client.id_user,
            services,
            total
        });

        await facture.save();
        res.status(201).json({ message: "Facture générée avec succès.", facture });

    } catch (error) {
        console.error("❌ [ERREUR] Erreur lors de la génération de la facture :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.getFacturesByClient = async (req, res) => {
    try {
        const id_client = req.user.id;

        const factures = await Facture.find({ id_client })
            .populate("id_devis") 
            .populate("id_client")
            .populate("services");

        if (!factures || factures.length === 0) {
            return res.status(404).json({ message: "Aucune facture trouvée." });
        }

        res.json(factures);
    } catch (error) {
        console.error("❌ Erreur récupération factures :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


