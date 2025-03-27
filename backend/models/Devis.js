const mongoose = require("mongoose");

const DevisSchema = new mongoose.Schema({
  date_devis: { type: Date, default: Date.now, required: true },
  id_rendez_vous_client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "RendezVousClient", 
    required: true 
  },
  montant_total: { type: mongoose.Types.Decimal128, required: true }
});

module.exports = mongoose.model("Devis", DevisSchema);
