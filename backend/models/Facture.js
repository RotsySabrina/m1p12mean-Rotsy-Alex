const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema({
    id_devis: { type: mongoose.Schema.Types.ObjectId, ref: "Devis", required: true },
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    services: [{
        id_service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
        nom_service: String,
        prix: Number
    }],
    total: { type: Number, required: true },
    date_facturation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Facture", FactureSchema);
