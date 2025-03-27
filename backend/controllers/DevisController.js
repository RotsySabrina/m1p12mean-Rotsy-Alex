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
  
      for (let devis of filteredDevis) {
        const services = await RendezVousService.find({ id_rendez_vous_client: devis.id_rendez_vous_client._id })
          .populate({
            path: "id_service",
            select: "description cout",
          })
          .exec();
  
        devis = devis.toObject(); 
        devis.services = services.map((s) => ({
          description: s.id_service.description,
          cout: s.id_service.cout,
        }));
      }
  
      return res.status(200).json(filteredDevis);
    } catch (error) {
      console.error("Erreur lors de la récupération des devis :", error);
      return res.status(500).json({ message: "Erreur lors de la récupération des devis", error });
    }
  };

