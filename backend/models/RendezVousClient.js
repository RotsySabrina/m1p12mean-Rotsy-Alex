const mongoose = require("mongoose");


const RendezVousClientSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    id_vehicule: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicule", required: true },
    date_heure: { type: Date, required: true },
    duree_totale: {type: Number, required: true},
    id_mecanicien: {type:mongoose.Schema.Types.ObjectId,ref: 'MecanicienSpecialisation'}
}, { timestamps: true });

module.exports = mongoose.model("RendezVousClient", RendezVousClientSchema);
