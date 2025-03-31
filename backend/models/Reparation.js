const mongoose = require("mongoose");

const ReparationSchema = new mongoose.Schema({
    id_devis: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Devis", 
        required: true, 
        unique: true 
    },
    id_mecanicien: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["en_attente", "en_cours", "terminee"], 
        default: "en_attente" 
    },
    date_debut: { type: Date },
    date_fin: { type: Date },
    observations: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Reparation", ReparationSchema);
