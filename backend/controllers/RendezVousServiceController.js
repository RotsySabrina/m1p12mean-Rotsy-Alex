const RendezVousService = require("../models/RendezVousService");

exports.insertRendezVousServices = async (idRendezVousClient, idServices) => {
    try {
      if (!idServices || idServices.length === 0) {
        throw new Error("Aucun service à ajouter.");
      }
  
      const servicesToInsert = idServices.map(idService => ({
        id_rendez_vous_client: idRendezVousClient,
        id_service: idService
      }));
  
      const insertedServices = await RendezVousService.insertMany(servicesToInsert);
  
      return insertedServices;
    } catch (error) {
      console.error("Erreur lors de l'insertion des services au rendez-vous:", error);
      throw error;
    }
};