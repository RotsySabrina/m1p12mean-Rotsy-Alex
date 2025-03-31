const ReparationService = require("../models/ReparationService");
const Service = require('../models/Service'); 

exports.getServicesByReparationId = async (req, res) => {
  try {
    const { id_reparation } = req.params; 
    const services = await ReparationService.find({ id_reparation })
      .populate({
        path: 'id_service', 
        select: 'description cout' 
      })
      .exec();

    if (services.length === 0) {
      return res.status(404).json({ message: "Aucun service trouvé pour cette réparation." });
    }

    res.status(200).json({ services });
  } catch (error) {
    console.error("Erreur lors de la récupération des services de réparation:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des services", error });
  }
};

exports.mettreAJourStatutService = async (req, res) => {
    try {
        const { id_service } = req.params;
        const { status, observations } = req.body;

        const service = await ReparationService.findByIdAndUpdate(
            id_service,
            { status, observations },
            { new: true }
        );

        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
