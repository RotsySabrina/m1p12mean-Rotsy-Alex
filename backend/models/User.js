const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    mot_de_passe: { type: String, required: true },
    role: { type: String, enum: ["client", "mecanicien", "manager"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);