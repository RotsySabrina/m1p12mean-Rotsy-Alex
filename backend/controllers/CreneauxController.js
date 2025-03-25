const RendezVous = require("../models/RendezVousClient");
const RegleCreneau = require("../models/RegleCreneau");
const CategorieService = require("../models/CategorieService");
const moment = require("moment");

exports.addRegleCrenaux = async (req, res) => {
  try {
    const { heure_ouverture, heure_fermeture, pause_debut, pause_fin, jours_non_travailles } = req.body;
    const newRegle = new RegleCreneau({
      heure_ouverture,
      heure_fermeture,
      pause_debut,
      pause_fin,
      jours_non_travailles
    });
    await newRegle.save();
    res.status(210).json({ message: "Regle ajouté avec succès !" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.updateRegleCreneau = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const regle = await RegleCreneau.findByIdAndUpdate(id, updates, { new: true });
    if (!regle) {
      return res.status(404).json({ message: "Règle non trouvée" });
    }

    res.json({ message: "Règle mise à jour avec succès", regle });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getCreneauxDisponibles = async (req, res) => {
  try {
      const { date, categorieServices } = req.query; // format "YYYY-MM-DD"

      console.log("🔍 Requête reçue avec :", { date, categorieServices });

      if (!date || !categorieServices) {
          console.log("❌ Date ou categorieServices manquants");
          return res.status(400).json({ message: "Date et categorieServices requis" });
      }

      const regle = await RegleCreneau.findOne();
      if (!regle) {
          console.log("❌ Aucune règle de créneau trouvée !");
          return res.status(500).json({ message: "Règles des créneaux non définies" });
      }

      const jourSemaine = moment(date).format("dddd").toLowerCase();
      console.log("📅 Jour demandé :", jourSemaine);

      if (regle.jours_non_travailles.includes(jourSemaine)) {
          console.log("⛔ Le garage est fermé ce jour-là :", jourSemaine);
          return res.status(400).json({ message: "Le garage est fermé ce jour-là" });
      }

      let services;
      try {
          services = typeof categorieServices === "string" ? JSON.parse(categorieServices) : categorieServices;
      } catch (e) {
          console.log("⚠️ Erreur de parsing JSON :", e);
          return res.status(400).json({ message: "Format de categorieServices invalide" });
      }

      console.log("📌 Catégorie services :", services);

      // Récupération des durées des services depuis la base de données
      const catServicesDetails = await CategorieService.find({ _id: { $in: services } });

      let dureeTotale = catServicesDetails.reduce((total, service) => total + (service.duree || 0), 0);
      console.log("⏳ Durée totale requise :", dureeTotale, "minutes");

      if (dureeTotale === 0) {
          return res.status(400).json({ message: "La durée totale des services ne peut pas être 0" });
      }

      const heureOuverture = moment(`${date} ${regle.heure_ouverture}`, "YYYY-MM-DD HH:mm");
      const heureFermeture = moment(`${date} ${regle.heure_fermeture}`, "YYYY-MM-DD HH:mm");
      const pauseDebut = regle.pause_debut ? moment(`${date} ${regle.pause_debut}`, "YYYY-MM-DD HH:mm") : null;
      const pauseFin = regle.pause_fin ? moment(`${date} ${regle.pause_fin}`, "YYYY-MM-DD HH:mm") : null;

      let creneaux = [];
      let currentTime = heureOuverture.clone();

      while (currentTime.clone().add(dureeTotale, "minutes").isSameOrBefore(heureFermeture)) {
          if (pauseDebut && currentTime.isBetween(pauseDebut, pauseFin, null, "[)")) {
              currentTime = pauseFin.clone();
              continue;
          }

          // Vérification des conflits
          const conflit = await RendezVous.find({
              $or: [
                  {
                      date_heure: {
                          $lt: currentTime.clone().add(dureeTotale, "minutes").toDate(),
                          $gte: currentTime.toDate()
                      }
                  },
                  {
                      date_heure: {
                          $lte: currentTime.toDate()
                      },
                      $expr: {
                          $gte: [
                              { $add: ["$date_heure", { $multiply: ["$duree_totale", 60000] }] },
                              currentTime.toDate()
                          ]
                      }
                  }
              ]
          });

          console.log("📌 Conflits trouvés à", currentTime.format("HH:mm"), ":", conflit.length);

          if (conflit.length === 0) {
              // console.log("✅ Créneau disponible :", currentTime.format("HH:mm"));
              creneaux.push(currentTime.format("HH:mm"));
          } else {
              console.log("❌ Créneau occupé :", currentTime.format("HH:mm"));
          }

          currentTime.add(30, "minutes"); // Créneaux de 30 minutes
      }

      console.log("📌 Créneaux disponibles :", creneaux);
      res.json({ creneaux });
  } catch (error) {
      console.error("💥 Erreur serveur :", error);
      res.status(500).json({ message: "Erreur serveur" });
  }
};
