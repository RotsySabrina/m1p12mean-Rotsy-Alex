const RendezVousService = require("../models/RendezVousService");
const RendezVousCategorieService = require("../models/RendezVousCategorieService");
const Service = require("../models/Service");
const CategorieService = require("../models/CategorieService"); 

exports.insertRendezVousServices = async (req, res) => {
    try {
        // console.log("Données reçues :", req.body); 
        const { id_rendez_vous_client, idServices } = req.body;

        if (!id_rendez_vous_client || !Array.isArray(idServices) || idServices.length === 0) {
            return res.status(400).json({ error: "Données invalides." });
        }

        const servicesToInsert = idServices.map(idService => ({
            id_rendez_vous_client: id_rendez_vous_client,
            id_service: idService
        }));

        const insertedServices = await RendezVousService.insertMany(servicesToInsert);

        return res.status(201).json(insertedServices);
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
};

exports.selectRendezVousServices = async (req, res) => {
    try {
      const { id_rendez_vous_client } = req.params;
      console.log("ID du rendez-vous client reçu :", id_rendez_vous_client);
  
      const rendezVousServices = await RendezVousService.find({ id_rendez_vous_client: id_rendez_vous_client })
        .populate({
          path: 'id_service', 
          populate: {
            path: 'id_categorie_service', 
            model: CategorieService
          }
        })
        .exec();
  
      if (!rendezVousServices || rendezVousServices.length === 0) {
        console.log("Aucun service trouvé pour ce rendez-vous.");
        return res.status(404).json({ message: 'Aucun service trouvé pour ce rendez-vous.' });
      }
  
      const servicesWithCategories = rendezVousServices.map(item => {
        const service = item.id_service; 
        const categorie = service.id_categorie_service;
        return {
          serviceDescription: service.description,
          serviceCout: service.cout,
          categoryDescription: categorie ? categorie.description : null
        };
      });
  
      console.log("Services avec catégories transformés :", servicesWithCategories);
      return res.status(200).json(servicesWithCategories);
    } catch (error) {
      console.error("Erreur lors de la récupération des services pour le rendez-vous:", error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };

exports.getServicesByCategoryForRdv = async (req, res) => {
    try {
        const { id_rendez_vous_client } = req.params;

        if (!id_rendez_vous_client) {
            return res.status(400).json({ message: "L'ID du rendez-vous client est requis" });
        }

        const rendezVousCategories = await RendezVousCategorieService.find({ id_rendez_vous_client })
            .populate("id_categorie_service", "nom")
            .exec();

        if (!rendezVousCategories.length) {
            console.log("⚠️ Aucun service trouvé pour ce rendez-vous.");
            return res.status(404).json({ message: "Aucune catégorie de service trouvée pour ce rendez-vous" });
        }

        const categoriesIds = rendezVousCategories.map(cat => cat.id_categorie_service._id);

        const services = await Service.find({ id_categorie_service: { $in: categoriesIds } })
            .populate({
                path: "id_categorie_service",
                select: "description" 
            })
            .exec();

        if (!services.length) {
            return res.status(404).json({ message: "Aucun service correspondant trouvé" });
        }

        const servicesByCategory = {};
        services.forEach(service => {
            const categoryName = service.id_categorie_service.description;

            if (!servicesByCategory[categoryName]) {
                servicesByCategory[categoryName] = [];
            }
            servicesByCategory[categoryName].push({
                id: service._id,
                description: service.description,
                cout: service.cout,
            });
        });

        console.log("Services regroupés par catégorie :", servicesByCategory);

        return res.status(200).json(servicesByCategory);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des services", error });
    }
};

