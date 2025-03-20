const mongoose = require("mongoose");

const regleCreneauSchema = new mongoose.Schema({
  heure_ouverture: { type: String, required: true },
  heure_fermeture: { type: String, required: true }, 
  pause_debut: { type: String, required: false },
  pause_fin: { type: String, required: false }, 
  jours_non_travailles: { type: [String], default: ["dimanche"] }
});

module.exports = mongoose.model("RegleCreneau", regleCreneauSchema);
