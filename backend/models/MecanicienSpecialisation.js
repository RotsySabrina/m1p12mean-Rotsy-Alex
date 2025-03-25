const mongoose = require("mongoose");

const mecanicienSpecialisationSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    id_categorie_service: { type: mongoose.Schema.Types.ObjectId, ref: "CategorieService", required: true }
}, { timestamps: true });

module.exports = mongoose.model("MecanicienSpecialisation", mecanicienSpecialisationSchema);