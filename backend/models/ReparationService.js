const mongoose = require("mongoose");

const ReparationServiceSchema = new mongoose.Schema({
    id_reparation: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Reparation", 
        required: true 
    },
    id_service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Service", 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["en_attente", "en_cours", "terminee"], 
        default: "en_attente" 
    },
    observations: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("ReparationService", ReparationServiceSchema);
