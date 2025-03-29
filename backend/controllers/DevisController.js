const Devis = require("../models/Devis");
const Service = require("../models/Service");
const RendezVousService = require("../models/RendezVousService");

exports.createDevis = async (req, res) => {
    try {
      const { id_rendez_vous_client, montant_total } = req.body;

      const newDevis = new Devis({
        id_rendez_vous_client,
        montant_total
      });
  
      const savedDevis = await newDevis.save();
  
      console.log("Devis inséré avec succès :", savedDevis);
      return res.status(201).json(savedDevis);
    } catch (error) {
      console.error("Erreur lors de l'insertion du devis :", error);
      return res.status(500).json({ message: "Erreur lors de l'insertion du devis", error });
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

exports.getDevisByClientId = async (req, res) => {
    try {
      const id_user = req.user.id;
  
      if (!id_user) {
        return res.status(400).json({ message: "L'ID du client est requis" });
      }
  
      const devis = await Devis.find()
        .populate({
          path: "id_rendez_vous_client",
          match: { id_user: id_user },
          populate: {
            path: "id_user",
            select: "nom prenom email",
          },
        })
        .exec();
  
        const filteredDevis = devis.filter((devis) => devis.id_rendez_vous_client !== null);

        if (filteredDevis.length === 0) {
          return res.status(404).json({ message: "Aucun devis trouvé pour ce client" });
        }
        
        for (let i = 0; i < filteredDevis.length; i++) {
          const devis = filteredDevis[i];
        
          const services = await RendezVousService.find({ id_rendez_vous_client: devis.id_rendez_vous_client._id })
            .populate({
              path: "id_service",
              select: "description cout",
            })
            .exec();
        
          const devisObject = devis.toObject(); 
          devisObject.services = services.map((s) => ({
            description: s.id_service.description,
            cout: s.id_service.cout,
          }));
        
          filteredDevis[i] = devisObject;
        }
  
      return res.status(200).json(filteredDevis);
    } catch (error) {
      console.error("Erreur lors de la récupération des devis :", error);
      return res.status(500).json({ message: "Erreur lors de la récupération des devis", error });
    }
  };

  exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body;

        const validStatuses = ["en_attente", "accepte", "refuse"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Statut invalide." });
        }
        console.log("status reçu:", status);
        const updatedDevis = await Devis.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedDevis) {
            return res.status(404).json({ message: "Devis non trouvé." });
        }

        res.status(200).json({ message: "Statut mis à jour avec succès", devis: updatedDevis });
    } catch (error) {
        console.log("Erreur status :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message });
    }
};

