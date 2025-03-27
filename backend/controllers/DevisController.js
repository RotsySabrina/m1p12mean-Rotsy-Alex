const Devis = require("../models/Devis");
const Service = require("../models/Service");

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

