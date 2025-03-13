const mongoose = require("mongoose");

const RendezVousClientSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    date_heure: { type: Date, required: true },
    probleme_specifique: { type: String },
    status: { type: String, enum: ["confirmé", "annulé", "en attente"], default: "en attente" }
}, { timestamps: true });

module.exports = mongoose.model("RendezVousClient", RendezVousClientSchema);
