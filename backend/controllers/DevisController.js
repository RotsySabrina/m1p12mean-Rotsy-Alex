const Devis = require("../models/Devis");
const Service = require("../models/Service");
const RendezVousService = require("../models/RendezVousService");
const User = require("../models/User");
const RendezVousClient = require("../models/RendezVousClient");
const Notification = require("../models/Notification");

exports.createDevis = async (req, res) => {
  try {
    const { id_rendez_vous_client, montant_total } = req.body;
    console.log("📩 Données reçues du montant:", { id_rendez_vous_client, montant_total });

    const newDevis = new Devis({
      id_rendez_vous_client,
      montant_total
    });

    const savedDevis = await newDevis.save();

    console.log("Devis inséré avec succès :", savedDevis);

    // Trouver le rendez-vous client associé pour récupérer l'id_user
    const rendezVous = await RendezVousClient.findById(id_rendez_vous_client);
    if (!rendezVous) {
      console.log("Rendez-vous non trouvé pour l'ID :", id_rendez_vous_client);  // Log si le rendez-vous n'est pas trouvé
      return res.status(404).json({ success: false, message: "Rendez-vous non trouvé" });
    }

    console.log("Rendez-vous trouvé :", rendezVous);  // Log des détails du rendez-vous

    const clientId = rendezVous.id_user;
    console.log("ID du client associé au rendez-vous :", clientId);  // Log de l'ID du client

    // Trouver l'utilisateur (client) à qui le devis est destiné
    const client = await User.findById(clientId);
    if (!client) {
      console.log("Client non trouvé pour l'ID :", clientId);  // Log si le client n'est pas trouvé
      return res.status(404).json({ success: false, message: "Client non trouvé" });
    }

    console.log("Client trouvé :", client);  // Log des détails du client

    // Créer une notification pour le client
    const newNotification = new Notification({
      userId: clientId,  // L'utilisateur est le client
      message: `Vous avez reçu un nouveau devis d'un montant total de ${montant_total} Ar.`,
    });

    await newNotification.save();
    console.log("Notification envoyée au client :", newNotification);  // Log de la notification envoyée


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

    // Récupérer les devis avec id_user et id_rendez_vous_client existant
    const devis = await Devis.find()
      .populate({
        path: "id_rendez_vous_client",
        match: { id_user: id_user },
        populate: { path: "id_user", select: "nom prenom email" },
      })
      .lean(); // Optimisation de performance

    // Filtrer uniquement les devis valides
    const filteredDevis = devis.filter((d) => d.id_rendez_vous_client !== null);

    if (filteredDevis.length === 0) {
      return res.status(404).json({ message: "Aucun devis trouvé pour ce client" });
    }

    // Récupérer les services pour tous les rendez-vous en une seule requête
    const rendezVousIds = filteredDevis.map((d) => d.id_rendez_vous_client._id);

    const services = await RendezVousService.find({ id_rendez_vous_client: { $in: rendezVousIds } })
      .populate({ path: "id_service", select: "description cout" })
      .lean();

    // Associer les services aux devis
    const servicesByRdv = {};
    services.forEach((s) => {
      const rdvId = s.id_rendez_vous_client.toString();
      if (!servicesByRdv[rdvId]) servicesByRdv[rdvId] = [];
      servicesByRdv[rdvId].push({
        id: s.id_service._id,
        description: s.id_service.description,
        cout: s.id_service.cout,
      });
    });

    // Ajouter les services aux devis correspondants
    const result = filteredDevis.map((devis) => ({
      ...devis,
      services: servicesByRdv[devis.id_rendez_vous_client._id.toString()] || [],
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des devis :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des devis", error });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("🔹 Début de la mise à jour du statut du devis");
    console.log("📌 ID du devis reçu :", id);
    console.log("📌 Nouveau statut reçu :", status);

    // Vérifier si le statut est valide
    const validStatuses = ["en_attente", "accepte", "refuse"];
    if (!validStatuses.includes(status)) {
      console.log("❌ Statut invalide :", status);
      return res.status(400).json({ message: "Statut invalide." });
    }

    // Trouver le devis et le mettre à jour
    console.log("🔎 Recherche du devis en base de données...");
    const updatedDevis = await Devis.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedDevis) {
      console.log("❌ Devis non trouvé pour l'ID :", id);
      return res.status(404).json({ message: "Devis non trouvé." });
    }

    console.log("✅ Devis mis à jour avec succès :", updatedDevis);

    // Vérifier si le devis est "accepté" avant d'envoyer la notification
    if (status === "accepte") {
      console.log("🔹 Le devis a été accepté, préparation de la notification...");

      // Récupérer le rendez-vous client associé
      console.log("🔎 Recherche du rendez-vous client associé...");
      const rendezVous = await RendezVousClient.findById(updatedDevis.id_rendez_vous_client);
      if (!rendezVous) {
        console.log("❌ Rendez-vous non trouvé pour l'ID :", updatedDevis.id_rendez_vous_client);
        return res.status(404).json({ message: "Rendez-vous non trouvé." });
      }

      console.log("✅ Rendez-vous trouvé :", rendezVous);

      // Récupérer l'ID du mécanicien assigné
      const mecanicienId = rendezVous.id_mecanicien;
      if (!mecanicienId) {
        console.log("❌ Aucun mécanicien associé au rendez-vous.");
        return res.status(400).json({ message: "Aucun mécanicien associé au rendez-vous." });
      }

      console.log("👨‍🔧 ID du mécanicien :", mecanicienId);

      // Récupérer l'ID du client
      const clientId = rendezVous.id_user;
      console.log("👤 ID du client :", clientId);

      // Créer une notification pour le mécanicien
      console.log("✉️ Création de la notification pour le mécanicien...");
      const newNotification = new Notification({
        userId: mecanicienId,
        message: `🔔 Le client ${clientId} a accepté le devis ID: ${id}.`,
      });

      await newNotification.save();
      console.log("✅ Notification envoyée au mécanicien :", newNotification);
    }

    console.log("🚀 Fin de la mise à jour du statut du devis");

    return res.status(200).json({ message: "Statut mis à jour avec succès", devis: updatedDevis });

  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: error.message });
  }
};


