const mongoose = require("mongoose");

const vehiculeSchema = new mongoose.Schema({
    id_user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    marque: {type: String, required: true},
    modele: { type: String, required: true },
    immatriculation: { type: String, required: true, unique: true },
    annee: { type: Number, required: true }
},{timestamps: true});

module.exports = mongoose.model("Vehicule", vehiculeSchema);