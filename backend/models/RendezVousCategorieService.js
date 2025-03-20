const mongoose = require("mongoose");

const RendezVousCategorieServiceSchema = new mongoose.Schema({
  id_rendez_vous_client: { type: mongoose.Schema.Types.ObjectId, ref: "RendezVousClient", required: true },
  id_categorie_service: { type: mongoose.Schema.Types.ObjectId, ref: "CategorieService", required: true },
});

module.exports = mongoose.model("RendezVousCategorieService", RendezVousCategorieServiceSchema);