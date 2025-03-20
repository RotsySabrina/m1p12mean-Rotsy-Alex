const RendezVous = require("../models/RendezVousClient");
const RegleCreneau = require("../models/RegleCreneau");
const moment = require("moment");

exports.addRegleCrenaux = async (req, res) =>{
    try {
        const{heure_ouverture, heure_fermeture, pause_debut, pause_fin, jours_non_travailles} = req.body;
        const newRegle = new RegleCreneau({
            heure_ouverture,
            heure_fermeture,
            pause_debut,
            pause_fin,
            jours_non_travailles
        });
        await newRegle.save();
        res.status(210).json({message: "Regle ajouté avec succès !"})
    } catch (error) {
        res.status(500).json({message: "Erreur serveur", error});
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
  
      console.log("✅ Règles trouvées :", regle);
  
      const jourSemaine = moment(date).format("dddd").toLowerCase();
      console.log("📅 Jour demandé :", jourSemaine);
  
      if (regle.jours_non_travailles.includes(jourSemaine)) {
        console.log("⛔ Le garage est fermé ce jour-là :", jourSemaine);
        return res.status(400).json({ message: "Le garage est fermé ce jour-là" });
      }
  
      let dureeTotale = 0;
      const services = JSON.parse(categorieServices);
      for (let service of services) {
        dureeTotale += service.duree;
      }
  
      console.log("⏳ Durée totale requise :", dureeTotale, "minutes");
  
      const heureOuverture = moment(`${date} ${regle.heure_ouverture}`, "YYYY-MM-DD HH:mm");
      const heureFermeture = moment(`${date} ${regle.heure_fermeture}`, "YYYY-MM-DD HH:mm");
      const pauseDebut = regle.pause_debut ? moment(`${date} ${regle.pause_debut}`, "YYYY-MM-DD HH:mm") : null;
      const pauseFin = regle.pause_fin ? moment(`${date} ${regle.pause_fin}`, "YYYY-MM-DD HH:mm") : null;
  
      console.log("🕗 Heures d'ouverture et de fermeture :", heureOuverture.format(), "-", heureFermeture.format());
  
      let creneaux = [];
      let currentTime = heureOuverture.clone();
  
      while (currentTime.clone().add(dureeTotale, "minutes").isSameOrBefore(heureFermeture)) {
        if (pauseDebut && currentTime.isBetween(pauseDebut, pauseFin, null, "[)")) {
          console.log("⏸ Pause détectée, passage à :", pauseFin.format());
          currentTime = pauseFin.clone();
          continue;
        }
  
        console.log("🧐 Vérification de la disponibilité à :", currentTime.format("HH:mm"));
  
        const conflit = await RendezVous.findOne({
          date_heure: { 
            $lt: currentTime.clone().add(dureeTotale, "minutes").toDate(),
            $gte: currentTime.toDate()
          }
        });
  
        if (!conflit) {
          console.log("✅ Créneau disponible :", currentTime.format("HH:mm"));
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
